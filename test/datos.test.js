// Pruebas sobre los datos reales que publica la web (data/calendario.json).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { crearCalendario } from '../src/lib/calendario.js';
import { calcularPlazo } from '../src/lib/plazos.js';

const datos = JSON.parse(readFileSync(new URL('../data/calendario.json', import.meta.url)));
const cal = crearCalendario(datos);
const LES = '25121';
const BCN = '08019';

test('Arán 2027: el Lunes de Pascua no es inhábil y el 17/6 sí', () => {
  // 1 mes desde el 26/2/2027 -> 26/3 (Viernes Santo), 27-28 fin de semana -> lunes 29/3 (hábil en Arán).
  const les = calcularPlazo({ inicio: '2027-02-26', cantidad: 1, unidad: 'meses', municipios: [LES] }, cal);
  assert.equal(les.vencimiento, '2027-03-29');
  // Fuera de Arán el 29/3 es Lunes de Pascua -> 30/3.
  const bcn = calcularPlazo({ inicio: '2027-02-26', cantidad: 1, unidad: 'meses', municipios: [BCN] }, cal);
  assert.equal(bcn.vencimiento, '2027-03-30');
  // Interesado en Arán y órgano en Barcelona: el 29/3 es inhábil en uno de los dos (art. 30.6) -> 30/3.
  const ambos = calcularPlazo({ inicio: '2027-02-26', cantidad: 1, unidad: 'meses', municipios: [LES, BCN] }, cal);
  assert.equal(ambos.vencimiento, '2027-03-30');
  assert.ok(cal.motivosInhabil('2027-06-17', [LES]).length > 0);
  assert.equal(cal.motivosInhabil('2027-06-17', [BCN]).length, 0);
});

test('Arán 2026: el 17/6 es inhábil', () => {
  // 1 mes desde el 17/5/2026 -> 17/6 (Festa d'Aran) -> 18/6.
  const r = calcularPlazo({ inicio: '2026-05-17', cantidad: 1, unidad: 'meses', municipios: [LES] }, cal);
  assert.equal(r.vencimiento, '2026-06-18');
});

test('cada municipio tiene 2 fiestas locales o una anomalía documentada', () => {
  for (const [year, porMuni] of Object.entries(datos.locales)) {
    for (const [codigo, lista] of Object.entries(porMuni)) {
      const fechas = lista.map((f) => f.fecha);
      assert.equal(new Set(fechas).size, fechas.length, `${codigo} ${year}: fechas duplicadas`);
      if (lista.length !== 2) assert.ok(datos.anomalias?.[codigo], `${codigo} ${year}: ${lista.length} fiestas sin anomalía documentada`);
    }
  }
});

test('12 festivos generales por año en Cataluña (sin contar sustituciones territoriales)', () => {
  for (const year of ['2026', '2027']) {
    const comunes = datos.generales[year].filter((f) => !f.soloEn);
    assert.equal(comunes.length, 12, year);
  }
});

test('avisos: contencioso en meses, agrupados por año y límites por unidad', () => {
  const r = calcularPlazo({ inicio: '2026-06-15', cantidad: 2, unidad: 'meses', municipios: [BCN] }, cal);
  assert.ok(r.avisos.some((a) => a.tipo === 'contencioso'));
  const largo = calcularPlazo({ inicio: '2026-01-10', cantidad: 10, unidad: 'anos', municipios: [BCN, LES] }, cal);
  assert.ok(largo.avisos.filter((a) => a.tipo === 'sin_locales').length <= 10);
  assert.throws(() => calcularPlazo({ inicio: '2026-01-10', cantidad: 11, unidad: 'anos', municipios: [BCN] }, cal));
  assert.throws(() => calcularPlazo({ inicio: '9999-12-30', cantidad: 1, unidad: 'dias_habiles', municipios: [BCN] }, cal));
});
