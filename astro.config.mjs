import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
import { listaMunicipios, esIndexado } from './src/lib/municipios.js';

// Las páginas de municipio no indexadas (noindex) se excluyen del sitemap.
const datos = JSON.parse(readFileSync(new URL('./data/calendario.json', import.meta.url)));
const noIndexados = new Set();
for (const year of [2026, 2027]) {
  const conLocales = Boolean(datos.locales[String(year)]);
  for (const m of listaMunicipios(datos.municipios)) {
    if (!(esIndexado(m) && conLocales)) {
      noIndexados.add(`/ca/calendari-laboral/${year}/${m.slug}/`);
      noIndexados.add(`/es/calendario-laboral/${year}/${m.slug}/`);
    }
  }
}

export default defineConfig({
  site: 'https://diahabil.es',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (page) => !noIndexados.has(new URL(page).pathname) })],
});
