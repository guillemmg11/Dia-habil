import datos from '../../data/calendario.json';
import { listaMunicipios, esIndexado } from './municipios.js';

export const ANIOS = [2026, 2027];

// Las páginas de 2027 se publican pero no se indexan hasta que salgan los festivos locales de ese año.
export function rutasMunicipios() {
  const munis = listaMunicipios(datos.municipios);
  return ANIOS.flatMap((year) => munis.map((muni) => ({
    params: { year: String(year), muni: muni.slug },
    props: { muni, year, indexado: esIndexado(muni) && Boolean(datos.locales[String(year)]) },
  })));
}
