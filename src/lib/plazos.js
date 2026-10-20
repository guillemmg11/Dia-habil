import { sumarDias, sumarMeses, anio, parse } from './fechas.js';

/**
 * Calcula el vencimiento de un plazo administrativo según el art. 30 de la Ley 39/2015.
 *
 * opciones = {
 *   inicio: "YYYY-MM-DD"   fecha de notificación o publicación del acto
 *   cantidad: número entero > 0
 *   unidad: "dias_habiles" | "dias_naturales" | "meses" | "anos"
 *   municipios: [códigos]  municipio del interesado y de la sede del órgano (art. 30.6)
 * }
 *
 * Reglas aplicadas:
 * - El cómputo empieza el día siguiente a la notificación o publicación (arts. 30.3 y 30.4).
 * - Días hábiles: se excluyen sábados, domingos y festivos (art. 30.2).
 * - Días naturales: cuentan todos los días (art. 30.2).
 * - Meses y años: de fecha a fecha; si no existe el día equivalente, el último del mes (art. 30.4).
 * - Si el último día es inhábil, se prorroga al primer día hábil siguiente (art. 30.5).
 * - Es inhábil el día que lo sea en el municipio del interesado o en el de la sede del órgano (art. 30.6).
 *
 * Fuera de alcance: plazos procesales (agosto, 24-31 de diciembre), plazos en horas,
 * comunidades autónomas distintas de Cataluña.
 */
export function calcularPlazo(opciones, calendario) {
  const { inicio, cantidad, unidad, municipios = [] } = opciones;
  const LIMITES = { dias_habiles: 365, dias_naturales: 730, meses: 60, anos: 10 };
  if (!(unidad in LIMITES)) throw new Error(`Unidad no válida: ${unidad}`);
  parse(inicio);
  if (anio(inicio) < 2000 || anio(inicio) > 2100) throw new Error('La fecha debe estar entre los años 2000 y 2100');
  if (!Number.isInteger(cantidad) || cantidad <= 0 || cantidad > LIMITES[unidad]) {
    throw new Error(`La cantidad debe ser un número entero entre 1 y ${LIMITES[unidad]}`);
  }

  const excluidos = [];
  const inicioComputo = sumarDias(inicio, 1);
  let vencimientoTeorico;
  let vencimiento;
  let prorrogado = false;

  if (unidad === 'dias_habiles') {
    let fecha = inicio;
    let contados = 0;
    while (contados < cantidad) {
      fecha = sumarDias(fecha, 1);
      const motivos = calendario.motivosInhabil(fecha, municipios);
      if (motivos.length) excluidos.push({ fecha, motivos });
      else contados++;
    }
    vencimientoTeorico = fecha;
    vencimiento = fecha;
  } else {
    if (unidad === 'dias_naturales') vencimientoTeorico = sumarDias(inicio, cantidad);
    else if (unidad === 'meses') vencimientoTeorico = sumarMeses(inicio, cantidad);
    else vencimientoTeorico = sumarMeses(inicio, cantidad * 12);

    vencimiento = vencimientoTeorico;
    let motivos = calendario.motivosInhabil(vencimiento, municipios);
    while (motivos.length) {
      excluidos.push({ fecha: vencimiento, motivos });
      prorrogado = true;
      vencimiento = sumarDias(vencimiento, 1);
      motivos = calendario.motivosInhabil(vencimiento, municipios);
    }
  }

  // Avisos de datos incompletos: un año sin festivos generales cargados, o un municipio
  // sin festivos locales para algún año del cómputo.
  // Agrupados por año: como mucho un aviso de cada tipo y año.
  const avisos = [];
  for (let y = anio(inicioComputo); y <= anio(vencimiento); y++) {
    if (!calendario.tieneGenerales(y)) avisos.push({ tipo: 'sin_generales', anio: y });
    const sinLocales = [...new Set(municipios)].filter((c) => !calendario.tieneLocales(y, c));
    if (sinLocales.length) {
      avisos.push({ tipo: 'sin_locales', anio: y, municipios: sinLocales, nombres: sinLocales.map((c) => calendario.nombreMunicipio(c)) });
    }
  }
  // El recurso contencioso-administrativo (2 meses, art. 46 LJCA) se rige por reglas procesales
  // (agosto y del 24/12 al 6/1 inhábiles, art. 128.2 LJCA y art. 183 LOPJ): este cálculo no vale.
  if (unidad === 'meses') avisos.push({ tipo: 'contencioso' });

  return { inicio, inicioComputo, cantidad, unidad, vencimientoTeorico, vencimiento, prorrogado, excluidos, avisos };
}
