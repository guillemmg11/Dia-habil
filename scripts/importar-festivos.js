// Convierte el CSV de festivos locales de la Generalitat en el JSON que usa la web
// y genera un informe de validación.
//
// Uso: node scripts/importar-festivos.js <festes.csv> <año> > data/locales-<año>.json
// CSV: https://analisi.transparenciacatalunya.cat/api/views/b4eh-r8up/rows.csv?accessType=DOWNLOAD
//
// Validaciones (se escriben por stderr; no se publica sin revisarlas):
// - Filas de prueba en el dataset oficial (p. ej. "prueba", "prueba1"): se descartan.
// - Fechas fuera del año pedido: se descartan.
// - Municipios con un número de festivos locales distinto de 2: se avisan.
// - Núcleos con pedanía propia (pedania != "000"): se cuentan pero no se publican en la v1.
import { readFileSync } from 'node:fs';

const [, , ruta, anioTexto] = process.argv;
if (!ruta || !anioTexto) {
  console.error('Uso: node scripts/importar-festivos.js <festes.csv> <año>');
  process.exit(1);
}
const anio = String(anioTexto);

function parseCSV(texto) {
  const filas = [];
  let fila = [], campo = '', comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (comillas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') comillas = false;
      else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      fila.push(campo); filas.push(fila); fila = []; campo = '';
    } else campo += c;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  return filas.filter((f) => f.some((v) => v.trim() !== ''));
}

function normalizarFecha(v) {
  const iso = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const es = v.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (es) return `${es[3]}-${es[2]}-${es[1]}`;
  return null;
}

const [cabecera, ...filas] = parseCSV(readFileSync(ruta, 'utf8'));
const idx = (nombre) => {
  const i = cabecera.findIndex((c) => c.trim().toLowerCase() === nombre.toLowerCase());
  if (i < 0) throw new Error(`Columna no encontrada: ${nombre}. Cabecera: ${cabecera.join(' | ')}`);
  return i;
};
const col = {
  any: idx('Any calendari'), data: idx('Data'), nom: idx('Ajuntament o nucli municipal'),
  ine: idx('Codi municipi INE'), pedania: idx('Pedania'), festiu: idx('Festiu'),
};

const locales = {};
const municipios = {};
const informe = { filasAnio: 0, descartadasPrueba: [], descartadasFecha: [], pedanias: 0 };

for (const f of filas) {
  if (f[col.any]?.trim() !== anio) continue;
  informe.filasAnio++;
  const nombre = f[col.nom].trim();
  const festiu = f[col.festiu].trim();
  if (/\bprueba\d*\b|\btest\b/i.test(festiu)) { informe.descartadasPrueba.push(`${nombre}: ${festiu}`); continue; }
  const fecha = normalizarFecha(f[col.data].trim());
  if (!fecha || !fecha.startsWith(anio)) { informe.descartadasFecha.push(`${nombre}: ${f[col.data]}`); continue; }
  if (f[col.pedania].trim() !== '000') { informe.pedanias++; continue; }
  const ine = f[col.ine].trim().padStart(5, '0');
  municipios[ine] = nombre;
  (locales[ine] ??= []).push({ fecha, nombre: festiu });
}

for (const lista of Object.values(locales)) lista.sort((a, b) => a.fecha.localeCompare(b.fecha));
const anomalos = Object.entries(locales).filter(([, l]) => l.length !== 2)
  .map(([ine, l]) => `${municipios[ine]} (${ine}): ${l.length} festivos`);

console.error(`Año ${anio}: ${informe.filasAnio} filas, ${Object.keys(locales).length} municipios.`);
console.error(`Descartadas por ser de prueba: ${informe.descartadasPrueba.length}`, informe.descartadasPrueba.slice(0, 10));
console.error(`Descartadas por fecha incoherente: ${informe.descartadasFecha.length}`, informe.descartadasFecha.slice(0, 10));
console.error(`Núcleos con pedanía propia (no publicados en la v1): ${informe.pedanias}`);
console.error(`Municipios con un número de festivos distinto de 2: ${anomalos.length}`, anomalos.slice(0, 20));

process.stdout.write(JSON.stringify({ anio: Number(anio), municipios, locales }, null, 2));
