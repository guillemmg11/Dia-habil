import { chromium } from 'playwright';
const dir = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const err = [];
for (const [nombre, w, h] of [['escritorio', 1366, 900], ['movil', 390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  p.on('pageerror', (e) => err.push(e.message));
  await p.goto('http://localhost:4330/');
  await p.screenshot({ path: `${dir}/inicio-${nombre}-arriba.png` });
  await p.fill('input[name=muni1]', 'Sabadell');
  await p.fill('input[name=inicio]', '2026-10-30');
  await p.click('.atajo[data-n="10"]');
  await p.click('.calcular');
  await p.waitForTimeout(300);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.screenshot({ path: `${dir}/inicio-${nombre}-resultado.png`, fullPage: nombre === 'escritorio' });
  if (nombre === 'movil') { await p.locator('.resultado').scrollIntoViewIfNeeded(); await p.screenshot({ path: `${dir}/inicio-movil-hoja.png` }); }
  await p.goto('http://localhost:4330/es/calendario-laboral/2026/sabadell/');
  await p.screenshot({ path: `${dir}/municipio-${nombre}.png`, fullPage: true });
  await p.close();
}
console.log('errores', err);
await b.close();
