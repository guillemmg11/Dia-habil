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

test('cada municipio tiene 2 fiestas locales, un estado de la orden o una anomalía documentada', () => {
  for (const [year, porMuni] of Object.entries(datos.locales)) {
    for (const [codigo, lista] of Object.entries(porMuni)) {
      const fechas = lista.map((f) => f.fecha);
      assert.equal(new Set(fechas).size, fechas.length, `${codigo} ${year}: fechas duplicadas`);
      assert.ok(fechas.every((f) => f.startsWith(year)), `${codigo} ${year}: fecha de otro año`);
      const estado = datos.estado?.[year]?.[codigo];
      if (estado) assert.equal(lista.length, 0, `${codigo} ${year}: ${estado} pero con fiestas`);
      else if (lista.length !== 2) assert.ok(datos.anomalias?.[codigo], `${codigo} ${year}: ${lista.length} fiestas sin anomalía documentada`);
    }
  }
  for (const [year, porNucleo] of Object.entries(datos.nucleos ?? {})) {
    for (const [codigo, n] of Object.entries(porNucleo)) {
      assert.ok(datos.municipios[n.municipio], `núcleo ${codigo} sin municipio`);
      assert.ok(n.fechas.every((f) => f.fecha.startsWith(year)), `núcleo ${codigo}: fecha de otro año`);
    }
  }
});

test('2026: los 947 municipios de la orden del DOGC', () => {
  assert.equal(Object.keys(datos.municipios).length, 947);
});

test('núcleo con fiestas propias: Raimat (Lleida) y Vielha', () => {
  // Raimat: 27/4 y 24/7. Lleida: 11/5 y 29/9.
  assert.ok(cal.motivosInhabil('2026-04-27', ['25120-001']).some((m) => m.tipo === 'local'));
  assert.equal(cal.motivosInhabil('2026-04-27', ['25120']).length, 0);
  assert.ok(cal.motivosInhabil('2026-05-11', ['25120']).some((m) => m.tipo === 'local'));
  assert.equal(cal.motivosInhabil('2026-05-11', ['25120-001']).length, 0);
  // Vielha (núcleo de Vielha e Mijaran, en Arán): 8/9 local y 17/6 Festa d'Aran.
  assert.ok(cal.motivosInhabil('2026-09-08', ['25243-011']).some((m) => m.tipo === 'local'));
  assert.ok(cal.motivosInhabil('2026-06-17', ['25243-011']).length > 0);
  assert.equal(cal.nombreMunicipio('25243-011'), 'Vielha (Vielha e Mijaran)');
});

test('municipio sin propuesta: solo cuentan los festivos generales, sin aviso de datos pendientes', () => {
  // Cerdanyola del Vallès no formuló propuesta para 2026. 10 días hábiles desde el 1/9/2026:
  // 2,3,4,7,8,9,10, 11 Diada, 14,15,16 -> 16/9.
  const r = calcularPlazo({ inicio: '2026-09-01', cantidad: 10, unidad: 'dias_habiles', municipios: ['08266'] }, cal);
  assert.equal(r.vencimiento, '2026-09-16');
  assert.ok(!r.avisos.some((a) => a.tipo === 'sin_locales'));
});

test('Ordre EMT/3/2026: modificaciones aplicadas', () => {
  // Viladecans presentó propuesta tarde: 25/5 y 8/9. Mismo cálculo que Cerdanyola, pero el 8/9 es inhábil -> 17/9.
  const vila = calcularPlazo({ inicio: '2026-09-01', cantidad: 10, unidad: 'dias_habiles', municipios: ['08301'] }, cal);
  assert.equal(vila.vencimiento, '2026-09-17');
  // Castelldefels: el 14/9 se cambió por el 14/8.
  assert.ok(cal.motivosInhabil('2026-08-14', ['08056']).some((m) => m.tipo === 'local'));
  assert.equal(cal.motivosInhabil('2026-09-14', ['08056']).length, 0);
  // Sitges: se añadió el 24/8.
  assert.ok(cal.motivosInhabil('2026-08-24', ['08270']).some((m) => m.tipo === 'local'));
  assert.equal(datos.estado['2026']['08301'], undefined);
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
