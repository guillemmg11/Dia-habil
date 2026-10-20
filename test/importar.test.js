import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('el importador descarta filas de prueba y fechas incoherentes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'festes-'));
  const csv = join(dir, 'festes.csv');
  writeFileSync(csv, [
    'Any calendari,Data,Ajuntament o nucli municipal,Codi municipal,Codi municipi INE,Pedania,Festiu,Codi IDESCAT',
    '2026,11/05/2026,Sabadell,08187000,08187,000,Festa local,',
    '2026,07/09/2026,Sabadell,08187000,08187,000,Festa major,',
    '2026,13/05/2026,Aguilar de Segarra,08002000,08002,000,prueba2,',
    '2026,13/05/2025,Albanyà,17003000,17003,000,Festa local,',
    '2026,20/06/2026,"Sant Joan, nucli",08999001,08999,001,Festa del nucli,',
    '2025,12/05/2025,Sabadell,08187000,08187,000,Festa local,',
  ].join('\n'));
  const salida = execFileSync('node', ['scripts/importar-festivos.js', csv, '2026'], { stdio: ['ignore', 'pipe', 'pipe'] });
  const json = JSON.parse(salida.toString());
  assert.deepEqual(Object.keys(json.locales), ['08187']);
  assert.deepEqual(json.locales['08187'].map((f) => f.fecha), ['2026-05-11', '2026-09-07']);
});
