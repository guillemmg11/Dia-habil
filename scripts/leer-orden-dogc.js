// Lee el texto de la orden anual de fiestas locales del DOGC (pdftotext -layout) y la
// convierte en una lista estructurada. Sirve para contrastar los datos abiertos.
//
// Uso: pdftotext -layout orden.pdf orden.txt && node scripts/leer-orden-dogc.js orden.txt 2026 > data/orden-2026.json
//
// Formato de la orden:
//   COMARCA                                   (mayúsculas)
//   Municipi, 4 de maig i 29 de setembre.     (sin sangría)
//   Municipi, proposta no formulada.
//   Municipi                                  (sin fechas: le siguen sus núcleos sangrados)
//      Nucli, 15 de maig i 20 de juliol.
import { readFileSync } from 'node:fs';

const [, , ruta, anio] = process.argv;
const MESES = { gener: 1, febrer: 2, 'març': 3, abril: 4, maig: 5, juny: 6, juliol: 7, agost: 8, setembre: 9, octubre: 10, novembre: 11, desembre: 12 };

function fechas(texto) {
  const out = [];
  const re = /(\d{1,2}) d(?:e |')(gener|febrer|març|abril|maig|juny|juliol|agost|setembre|octubre|novembre|desembre)/g;
  let m;
  while ((m = re.exec(texto))) out.push(`${anio}-${String(MESES[m[2]]).padStart(2, '0')}-${m[1].padStart(2, '0')}`);
  return out;
}

const lineas = readFileSync(ruta, 'utf8').split('\n');
let inicio = lineas.findIndex((l) => /^Ordeno:/.test(l.trim()));
const fin = lineas.findIndex((l) => /^Disposició final/.test(l.trim()));
const ruido = /Diari Oficial de la Generalitat|CVE-DOGC|ISSN 1988|^\s*\d+\/\d+\s|^\(\d/;

const municipios = [];
let comarca = null;
let actual = null;
let pendiente = ''; // para entradas partidas en dos líneas

for (let i = inicio + 1; i < fin; i++) {
  const bruta = lineas[i];
  if (!bruta.trim() || ruido.test(bruta)) continue;
  const sangrada = /^\s{2,}\S/.test(bruta);
  let l = bruta.trim();
  if (/^Article únic|^Es fixa el calendari|^comarques\.|^En aquesta Ordre|^termini concedit/.test(l)) continue;
  if (l === l.toUpperCase() && /[A-ZÀ-Ú]/.test(l) && !/\d/.test(l)) { comarca = l; actual = null; continue; }

  l = (pendiente + ' ' + l).trim();
  // Una entrada continúa en la línea siguiente si queda claramente cortada: tiene coma pero
  // ninguna fecha ni "formulada", o termina en "i", "de" o "d'". (Sitges no lleva punto final.)
  // Si la siguiente línea con texto está sangrada, esta es la cabecera de un municipio con núcleos.
  let j = i + 1; while (j < fin && (!lineas[j].trim() || ruido.test(lineas[j]))) j++;
  const siguienteSangrada = !sangrada && /^\s{2,}\S/.test(lineas[j] ?? '');
  const cortada = !siguienteSangrada && (/\s(i|de|d')$/.test(l) ||
    (l.includes(',') && !fechas(l).length && !/formulada/.test(l) && !/^[^,]+,\s*(el|la|els|les|l')$/i.test(l)));
  if (cortada) { pendiente = l; continue; }
  pendiente = '';

  const sinPropuesta = /proposta no formulada/i.test(l);
  const fs = fechas(l);
  const nombre = (sinPropuesta || fs.length) ? l.replace(/,\s*(\d|proposta).*$/, '').trim() : l.replace(/\.$/, '').trim();

  if (sangrada && actual) {
    actual.nucleos.push({ nombre, fechas: fs, sinPropuesta });
  } else {
    actual = { comarca, nombre, fechas: fs, sinPropuesta, nucleos: [] };
    municipios.push(actual);
  }
}

console.error(`Municipios: ${municipios.length}. Sin propuesta: ${municipios.filter((m) => m.sinPropuesta).length}. ` +
  `Solo con núcleos: ${municipios.filter((m) => !m.fechas.length && !m.sinPropuesta).length}. ` +
  `Con un número de fechas distinto de 2: ${municipios.filter((m) => m.fechas.length && m.fechas.length !== 2).map((m) => `${m.nombre} (${m.fechas.length})`).join(', ') || 'ninguno'}`);
process.stdout.write(JSON.stringify({ anio: Number(anio), municipios }, null, 2));
