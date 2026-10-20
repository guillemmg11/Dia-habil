# diahabil.es

Calculadora de plazos administrativos (art. 30 Ley 39/2015) con los festivos locales de cada municipio de Cataluña, en catalán y castellano. Sitio estático con Astro, servido con nginx desde Coolify.

## Desarrollo

```
npm install
npm run dev        # http://localhost:4321
npm test           # pruebas del motor de cálculo y del importador
npm run build      # pruebas + comprobación de municipios indexados + compilación en dist/
```

`npm run build` falla si falla una prueba. El Dockerfile ejecuta `npm run build`, así que una prueba rota impide el despliegue.

## Despliegue en Coolify

1. Nuevo recurso en el proyecto: aplicación desde el repositorio de GitHub `guillemmg11/Dia-habil`, rama `main`.
2. Build pack: **Dockerfile**. Puerto expuesto: **80**.
3. Dominio: `https://diahabil.es` (y redirección de `www`).
4. DNS en Cloudflare con proxy activado: registros A de `diahabil.es` y `www` a 46.62.133.25. SSL en modo "Full (strict)".

## Actualización anual de festivos

La fuente principal es la orden anual de fiestas locales del DOGC. Los datos abiertos solo aportan los códigos INE.

1. Descargar el PDF de la orden (ficha en cido.diba.cat) y convertirlo: `pdftotext -layout orden.pdf orden.txt`
2. `node scripts/leer-orden-dogc.js orden.txt 2027 > data/orden-2027.json`
3. Descargar el CSV de datos abiertos (códigos INE):
   https://analisi.transparenciacatalunya.cat/api/views/b4eh-r8up/rows.csv?accessType=DOWNLOAD
4. `node scripts/construir-locales.js data/orden-2027.json festes.csv 2027 > data/locales-2027.json`
5. Revisar los informes de los dos scripts: municipios sin código, núcleos, número de fiestas distinto de 2.
6. Revisar también las órdenes que modifiquen la anual (en 2026, la Ordre EMT/3/2026).
7. Incorporar `municipios`, `locales`, `estado` y `nucleos` del año a `data/calendario.json`, y documentar en `anomalias` cualquier municipio con un número de fiestas distinto de 2.
8. Añadir a `generales` los festivos estatales y autonómicos del año siguiente, con nombre en `ca` y `es` y sus excepciones territoriales (Val d'Aran).

## Estado de los datos (20/10/2026)

- Festivos generales 2026 (Ordre EMT/66/2025) y 2027 (Ordre EMT/52/2026), con la sustitución del 17 de junio en la Val d'Aran. Falta cotejar el texto literal de Arán en el DOGC.
- Festivos locales 2026: los 947 municipios y 409 núcleos de la Ordre EMT/208/2025 (DOGC 9565). 33 ayuntamientos sin propuesta y 31 municipios con fiestas solo por núcleo. 9 municipios sin código INE en los datos abiertos llevan una clave provisional `dogc-*`.
- Contraste con los datos abiertos: 868 municipios idénticos fecha a fecha. Los datos abiertos omiten 77 municipios y atribuyen a Avinyonet del Penedès las fiestas de un núcleo.
- Pendiente: la Ordre EMT/3/2026 (DOGC 9586, 20/01/2026), que modifica la de 2026.
- Festivos locales 2027: pendientes de publicación.
