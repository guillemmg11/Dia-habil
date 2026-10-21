// Incorpora a data/calendario.json las fiestas locales aprobadas por los ayuntamientos y aún
// no publicadas en el DOGC. Uso: node scripts/cargar-provisionales.js data/provisionales-2027.json 2027
// Cuando salga la orden oficial del año, se carga con construir-locales.js y estas quedan anuladas
// (calendario.js da prioridad a datos.locales).
import { readFileSync, writeFileSync } from 'node:fs';
import { listaMunicipios } from '../src/lib/municipios.js';

const [archivo, year] = process.argv.slice(2);
const ruta = new URL('../data/calendario.json', import.meta.url);
const datos = JSON.parse(readFileSync(ruta));
const porNombre = new Map(listaMunicipios(datos.municipios).map((m) => [m.nombre, m.codigo]));
const entrada = JSON.parse(readFileSync(archivo));
const salida = {};
for (const [nombre, { fechas, fuente }] of Object.entries(entrada)) {
  const codigo = porNombre.get(nombre);
  if (!codigo) { console.error(`Municipio no encontrado: ${nombre}`); process.exitCode = 1; continue; }
  for (const f of fechas) if (!f.startsWith(`${year}-`)) throw new Error(`${nombre}: ${f} no es de ${year}`);
  if (fechas.length !== 2) console.warn(`Aviso: ${nombre} tiene ${fechas.length} fiestas`);
  salida[codigo] = { fuente, fechas: fechas.map((fecha) => ({ fecha, nombre: 'Festa local' })) };
}
datos.provisionales = { ...(datos.provisionales ?? {}), [year]: salida };
writeFileSync(ruta, JSON.stringify(datos));
console.log(`${Object.keys(salida).length} municipios con fiestas provisionales de ${year}`);
