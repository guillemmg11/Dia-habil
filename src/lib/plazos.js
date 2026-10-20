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
  parse(inicio);
  if (!Number.isInteger(cantidad) || cantidad <= 0 || cantidad > 3650) {
    throw new Error('La cantidad debe ser un número entero entre 1 y 3650');
  }
  const unidades = ['dias_habiles', 'dias_naturales', 'meses', 'anos'];
  if (!unidades.includes(unidad)) throw new Error(`Unidad no válida: ${unidad}`);

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
  const avisos = [];
  for (let y = anio(inicioComputo); y <= anio(vencimiento); y++) {
    if (!calendario.tieneGenerales(y)) {
      avisos.push({ tipo: 'sin_generales', anio: y, texto: `No hay festivos generales cargados para ${y}.` });
    }
    for (const codigo of new Set(municipios)) {
      if (!calendario.tieneLocales(y, codigo)) {
        avisos.push({
          tipo: 'sin_locales', anio: y, municipio: codigo,
          texto: `Aún no hay festivos locales de ${calendario.nombreMunicipio(codigo)} para ${y}. El resultado podría cambiar cuando se publiquen.`,
        });
      }
    }
  }

  return { inicio, inicioComputo, cantidad, unidad, vencimientoTeorico, vencimiento, prorrogado, excluidos, avisos };
}
