import { readFileSync } from 'node:fs';
import { listaMunicipios, INDEXADOS_NOMBRES } from '../src/lib/municipios.js';

const datos = JSON.parse(readFileSync(new URL('../data/calendario.json', import.meta.url)));
const nombres = new Set(listaMunicipios(datos.municipios).map((m) => m.nombre));
const faltan = INDEXADOS_NOMBRES.filter((n) => !nombres.has(n));
console.log(`Indexados encontrados: ${INDEXADOS_NOMBRES.length - faltan.length}/${INDEXADOS_NOMBRES.length}`);
if (faltan.length) console.log('No están en los datos:', faltan);
