import datos from '../../data/calendario.json';
import { listaMunicipios, esIndexado } from './municipios.js';

export const ANIOS = [2026, 2027];

// Una página se indexa si el municipio está en la lista y tiene fiestas locales de ese año
// (oficiales del DOGC o provisionales aprobadas por el ayuntamiento).
export const conLocales = (year, codigo) =>
  Boolean(datos.locales[String(year)]?.[codigo] || datos.provisionales?.[String(year)]?.[codigo]);
export function rutasMunicipios() {
  const munis = listaMunicipios(datos.municipios);
  return ANIOS.flatMap((year) => munis.map((muni) => ({
    params: { year: String(year), muni: muni.slug },
    props: { muni, year, indexado: esIndexado(muni) && conLocales(year, muni.codigo) },
  })));
}
