import { diaSemana, anio } from './fechas.js';

/**
 * Calendario de días inhábiles a efectos de plazos administrativos.
 *
 * datos = {
 *   generales: { "2026": [{ fecha, nombre, ambito: "estatal" | "autonomico" }] },
 *   locales:   { "2026": { "<codigo municipio>": [{ fecha, nombre }] } },
 *   municipios: { "<codigo>": "Nombre" }
 * }
 *
 * Los festivos generales ya deben venir combinados para Cataluña (los estatales que
 * Cataluña no sustituye más los autonómicos), tal como los fija la orden anual.
 */
export function crearCalendario(datos) {
  // Un festivo general puede llevar excepciones territoriales (p. ej. la Val d'Aran):
  //   excepto: [códigos]  no es festivo en esos municipios
  //   soloEn:  [códigos]  solo es festivo en esos municipios
  const generales = new Map();
  for (const [year, lista] of Object.entries(datos.generales ?? {})) {
    for (const f of lista) {
      const lista2 = generales.get(f.fecha) ?? [];
      lista2.push({ ...f, year: Number(year) });
      generales.set(f.fecha, lista2);
    }
  }

  // Art. 30.6: el día es inhábil si lo es en cualquiera de los municipios indicados.
  function aplica(f, municipios) {
    const lista = municipios.length ? municipios : [null];
    return lista.some((c) => {
      if (f.soloEn) return c !== null && f.soloEn.includes(c);
      if (f.excepto) return c === null || !f.excepto.includes(c);
      return true;
    });
  }

  function nombreMunicipio(codigo) {
    return datos.municipios?.[codigo] ?? codigo;
  }

  function tieneGenerales(year) {
    return Boolean(datos.generales?.[String(year)]);
  }

  function tieneLocales(year, codigo) {
    return Boolean(datos.locales?.[String(year)]?.[codigo]);
  }

  /**
   * Devuelve la lista de motivos por los que una fecha es inhábil (vacía si es hábil).
   * municipios: códigos de los municipios cuyos festivos locales cuentan
   * (art. 30.6 Ley 39/2015: el del interesado y el de la sede del órgano).
   */
  function motivosInhabil(fecha, municipios = []) {
    const motivos = [];
    const dow = diaSemana(fecha);
    if (dow === 6) motivos.push({ tipo: 'sabado', texto: 'Sábado' });
    if (dow === 0) motivos.push({ tipo: 'domingo', texto: 'Domingo' });

    // nombre puede ser una cadena o { ca, es }.
    for (const g of generales.get(fecha) ?? []) {
      if (!aplica(g, [...new Set(municipios)])) continue;
      motivos.push({ tipo: g.ambito, texto: typeof g.nombre === 'string' ? g.nombre : g.nombre.es, nombres: typeof g.nombre === 'string' ? null : g.nombre });
    }

    const year = String(anio(fecha));
    for (const codigo of new Set(municipios)) {
      const locales = datos.locales?.[year]?.[codigo] ?? [];
      for (const f of locales) {
        if (f.fecha === fecha) {
          motivos.push({ tipo: 'local', texto: `${f.nombre} (${nombreMunicipio(codigo)})`, municipio: codigo });
        }
      }
    }
    return motivos;
  }

  /** Festivos generales que aplican en un municipio concreto (para las páginas de municipio). */
  function generalesDe(year, codigo) {
    return (datos.generales?.[String(year)] ?? []).filter((f) => aplica(f, [codigo]));
  }

  return { motivosInhabil, tieneGenerales, tieneLocales, nombreMunicipio, generalesDe };
}
