// Genera los festivos locales de un año usando la orden del DOGC como fuente principal.
// El CSV de datos abiertos solo se usa para obtener los códigos INE de municipios y núcleos.
//
// Uso: node scripts/construir-locales.js data/orden-2026.json festes.csv 2026 [data/modificaciones-2026.json] > data/locales-2026.json
//
// Las modificaciones posteriores de la orden se aplican desde un fichero aparte: cada entrada
// indica el texto anterior ("antes") y se comprueba que coincide con la orden antes de sustituirlo.
//
// Salida:
//   municipios: { ine: nombre }
//   locales:    { ine: [{ fecha, nombre }] }       fiestas del municipio ([] si no hay propuesta)
//   estado:     { ine: "sin_propuesta" | "solo_nucleos" }
//   nucleos:    { "ine-ped": { municipio, nombre, fechas: [{ fecha, nombre }] } }
import { readFileSync } from 'node:fs';
import { nombreVisible } from '../src/lib/municipios.js';

const [, , rutaOrden, rutaCsv, anio, rutaMods] = process.argv;
const orden = JSON.parse(readFileSync(rutaOrden, 'utf8')).municipios;

if (rutaMods) {
  const mods = JSON.parse(readFileSync(rutaMods, 'utf8'));
  for (const mod of mods.municipios) {
    const m = orden.find((x) => x.nombre === mod.nombre);
    if (!m) throw new Error(`Modificación: ${mod.nombre} no está en la orden`);
    const eraSinPropuesta = /proposta no formulada/.test(mod.antes);
    if (eraSinPropuesta !== m.sinPropuesta) throw new Error(`Modificación: ${mod.nombre} no coincide con el texto anterior`);
    if (!eraSinPropuesta && m.fechas.length !== (mod.antes.match(/\d+ d/g) ?? []).length) throw new Error(`Modificación: ${mod.nombre} no coincide con el texto anterior`);
    m.fechas = mod.fechas; m.sinPropuesta = false;
  }
  console.error(`Modificaciones aplicadas (${mods.fuente}): ${mods.municipios.length}`);
}

function parseCSV(texto) {
  const filas = []; let fila = [], campo = '', q = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (q) { if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; } else if (c === '"') q = false; else campo += c; }
    else if (c === '"') q = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && texto[i + 1] === '\n') i++; fila.push(campo); filas.push(fila); fila = []; campo = ''; }
    else campo += c;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  return filas.filter((f) => f.length > 6);
}

const norm = (x) => nombreVisible(x.trim()).normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[’`´]/g, "'").toLowerCase().replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();

// Alias conocidos entre la orden y los datos abiertos.
const ALIAS = { [norm('Cornellà del Terri')]: norm('Cornellà de Terri') };

const [, ...filas] = parseCSV(readFileSync(rutaCsv, 'utf8'));
const inePorNombre = new Map();      // municipio → INE (filas 000 de cualquier año)
const nucleoPorNombre = new Map();   // "INE|nucli" → pedanía
const nucleosPorNombre = new Map();  // nucli → [INE] (para municipios que solo tienen núcleos)
for (const f of filas) {
  const nombre = f[2], ine = f[4]?.trim().padStart(5, '0'), ped = f[5]?.trim();
  if (!nombre || /^null$|^C\. A\./.test(nombre.trim()) || !/^(08|17|25|43)\d{3}$/.test(ine)) continue;
  if (ped === '000') inePorNombre.set(norm(nombre), ine);
  else {
    nucleoPorNombre.set(`${ine}|${norm(nombre)}`, ped);
    const l = nucleosPorNombre.get(norm(nombre)) ?? new Set(); l.add(ine); nucleosPorNombre.set(norm(nombre), l);
  }
}

const out = { anio: Number(anio), municipios: {}, locales: {}, estado: {}, nucleos: {} };
const sinCodigo = [], nucleosSinCodigo = [];
const fiesta = (fecha) => ({ fecha, nombre: 'Festa local' });

for (const m of orden) {
  const clave = ALIAS[norm(m.nombre)] ?? norm(m.nombre);
  let ine = inePorNombre.get(clave);
  if (!ine && m.nucleos.length) {
    // Deducir el INE a partir de los núcleos: el código común a todos los que aparezcan en el CSV.
    const candidatos = m.nucleos.map((n) => nucleosPorNombre.get(norm(n.nombre))).filter(Boolean);
    const comunes = candidatos.length ? [...candidatos[0]].filter((c) => candidatos.every((s) => s.has(c))) : [];
    if (comunes.length === 1) ine = comunes[0];
  }
  // Sin código INE en los datos abiertos: clave estable a partir del nombre (no es un código INE).
  if (!ine) { ine = 'dogc-' + norm(m.nombre).replace(/[^a-z0-9]+/g, '-'); sinCodigo.push(m.nombre); }

  out.municipios[ine] = m.nombre;
  out.locales[ine] = [...new Set(m.fechas)].sort().map(fiesta);
  if (m.sinPropuesta) out.estado[ine] = 'sin_propuesta';
  else if (!m.fechas.length) out.estado[ine] = 'solo_nucleos';

  m.nucleos.forEach((n, i) => {
    let ped = nucleoPorNombre.get(`${ine}|${norm(n.nombre)}`);
    if (!ped) { nucleosSinCodigo.push(`${n.nombre} (${m.nombre})`); ped = `x${String(i + 1).padStart(2, '0')}`; }
    out.nucleos[`${ine}-${ped}`] = { municipio: ine, nombre: n.nombre, sinPropuesta: n.sinPropuesta, fechas: [...new Set(n.fechas)].sort().map(fiesta) };
  });
}

const anomalos = Object.entries(out.locales).filter(([ine, l]) => !out.estado[ine] && l.length !== 2).map(([ine, l]) => `${out.municipios[ine]} (${l.length})`);
console.error(`Municipios: ${Object.keys(out.municipios).length} de ${orden.length} en la orden. Núcleos: ${Object.keys(out.nucleos).length}.`);
console.error(`Sin propuesta: ${Object.values(out.estado).filter((e) => e === 'sin_propuesta').length}. Solo núcleos: ${Object.values(out.estado).filter((e) => e === 'solo_nucleos').length}.`);
console.error(`Municipios sin código INE en los datos abiertos (clave provisional dogc-*): ${sinCodigo.length}`, sinCodigo);
console.error(`Núcleos sin código en el CSV (código provisional): ${nucleosSinCodigo.length}`, nucleosSinCodigo.slice(0, 15));
console.error(`Municipios con un número de fiestas distinto de 2: ${anomalos.length}`, anomalos);
process.stdout.write(JSON.stringify(out));
