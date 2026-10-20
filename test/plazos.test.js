// Casos resueltos a mano sobre el calendario de prueba. Cada caso indica el razonamiento.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { crearCalendario } from '../src/lib/calendario.js';
import { calcularPlazo } from '../src/lib/plazos.js';
import { sumarMeses } from '../src/lib/fechas.js';

const datos = JSON.parse(readFileSync(new URL('./fixtures/calendario-prueba.json', import.meta.url)));
const cal = crearCalendario(datos);
const BCN = '08019';
const SBD = '08187';

test('10 días hábiles sin festivos intermedios salvo fin de semana', () => {
  // Notificación lunes 19/10/2026. Se cuenta desde el 20: 20-23 (4), 26-30 (9), 2/11 (10).
  // El 1/11/2026 es domingo y en 2026 no es festivo en Cataluña.
  const r = calcularPlazo({ inicio: '2026-10-19', cantidad: 10, unidad: 'dias_habiles', municipios: [SBD] }, cal);
  assert.equal(r.inicioComputo, '2026-10-20');
  assert.equal(r.vencimiento, '2026-11-02');
});

test('el festivo local del municipio se excluye', () => {
  // Desde el 2/9/2026 en Sabadell: 2,3,4 (3); 7 festivo local; 8,9,10 (6); 11 Diada; 14,15,16,17 (10).
  const r = calcularPlazo({ inicio: '2026-09-01', cantidad: 10, unidad: 'dias_habiles', municipios: [SBD] }, cal);
  assert.equal(r.vencimiento, '2026-09-17');
  assert.ok(r.excluidos.some((e) => e.fecha === '2026-09-07' && e.motivos.some((m) => m.tipo === 'local')));
});

test('el festivo local de otro municipio no afecta', () => {
  // Mismo caso en Barcelona: el 7/9 es hábil. 2,3,4,7,8,9,10 (7); 11 Diada; 14,15,16 (10).
  const r = calcularPlazo({ inicio: '2026-09-01', cantidad: 10, unidad: 'dias_habiles', municipios: [BCN] }, cal);
  assert.equal(r.vencimiento, '2026-09-16');
});

test('art. 30.6: cuentan los festivos del municipio del interesado y del órgano', () => {
  // Desde el 16/9/2026. Solo Sabadell: 16,17,18,21,22,23,24,25,28,29 -> 29/9.
  // Sabadell + Barcelona: el 24/9 (La Mercè) es inhábil -> 30/9.
  const soloSabadell = calcularPlazo({ inicio: '2026-09-15', cantidad: 10, unidad: 'dias_habiles', municipios: [SBD] }, cal);
  const ambos = calcularPlazo({ inicio: '2026-09-15', cantidad: 10, unidad: 'dias_habiles', municipios: [SBD, BCN] }, cal);
  assert.equal(soloSabadell.vencimiento, '2026-09-29');
  assert.equal(ambos.vencimiento, '2026-09-30');
});

test('meses: sin día equivalente vence el último del mes, y si es inhábil se prorroga', () => {
  // 1 mes desde el 31/1/2026 -> 28/2/2026 (sábado) -> lunes 2/3/2026.
  const r = calcularPlazo({ inicio: '2026-01-31', cantidad: 1, unidad: 'meses', municipios: [BCN] }, cal);
  assert.equal(r.vencimientoTeorico, '2026-02-28');
  assert.equal(r.vencimiento, '2026-03-02');
  assert.equal(r.prorrogado, true);
});

test('meses: prórroga encadenada por domingo y festivo local', () => {
  // 1 mes desde el 24/4/2026 -> 24/5/2026 (domingo) -> 25/5 festivo local en Barcelona -> 26/5.
  const bcn = calcularPlazo({ inicio: '2026-04-24', cantidad: 1, unidad: 'meses', municipios: [BCN] }, cal);
  const sbd = calcularPlazo({ inicio: '2026-04-24', cantidad: 1, unidad: 'meses', municipios: [SBD] }, cal);
  assert.equal(bcn.vencimiento, '2026-05-26');
  assert.equal(sbd.vencimiento, '2026-05-25');
});

test('días naturales: cuentan los festivos, pero el último día inhábil se prorroga', () => {
  // 20 días naturales desde el 6/12/2026 -> 26/12 (sábado y Sant Esteve) -> 27 domingo -> lunes 28/12.
  const r = calcularPlazo({ inicio: '2026-12-06', cantidad: 20, unidad: 'dias_naturales', municipios: [BCN] }, cal);
  assert.equal(r.vencimientoTeorico, '2026-12-26');
  assert.equal(r.vencimiento, '2026-12-28');
});

test('Semana Santa 2027 y aviso por festivos locales no publicados', () => {
  // Desde el 22/3/2027: 22-25 (4); 26 Viernes Santo; 29 Lunes de Pascua; 30,31 (6); 1,2/4 (8); 5,6 (10).
  const r = calcularPlazo({ inicio: '2027-03-19', cantidad: 10, unidad: 'dias_habiles', municipios: [BCN] }, cal);
  assert.equal(r.vencimiento, '2027-04-06');
  assert.ok(r.avisos.some((a) => a.tipo === 'sin_locales' && a.anio === 2027));
});

test('plazo que cruza de año', () => {
  // 1 mes desde el 31/12/2026 -> 31/1/2027 (domingo) -> lunes 1/2/2027.
  const r = calcularPlazo({ inicio: '2026-12-31', cantidad: 1, unidad: 'meses', municipios: [BCN] }, cal);
  assert.equal(r.vencimiento, '2027-02-01');
});

test('años: de fecha a fecha, con 29 de febrero', () => {
  assert.equal(sumarMeses('2028-02-29', 12), '2029-02-28');
  // 1 año desde el 15/6/2026 -> 15/6/2027 (martes, hábil).
  const r = calcularPlazo({ inicio: '2026-06-15', cantidad: 1, unidad: 'anos', municipios: [BCN] }, cal);
  assert.equal(r.vencimiento, '2027-06-15');
});

test('notificación en día inhábil: el cómputo empieza igualmente al día siguiente', () => {
  // Notificación el sábado 3/10/2026; 5 días hábiles: 5,6,7,8,9/10 -> 9/10.
  const r = calcularPlazo({ inicio: '2026-10-03', cantidad: 5, unidad: 'dias_habiles', municipios: [BCN] }, cal);
  assert.equal(r.vencimiento, '2026-10-09');
});

test('entradas no válidas', () => {
  assert.throws(() => calcularPlazo({ inicio: '2026-02-30', cantidad: 5, unidad: 'dias_habiles' }, cal));
  assert.throws(() => calcularPlazo({ inicio: '2026-02-10', cantidad: 0, unidad: 'dias_habiles' }, cal));
  assert.throws(() => calcularPlazo({ inicio: '2026-02-10', cantidad: 5, unidad: 'semanas' }, cal));
});
