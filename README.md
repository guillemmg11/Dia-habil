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

Los festivos locales se publican en el DOGC cada diciembre.

1. Descargar el CSV de datos abiertos:
   https://analisi.transparenciacatalunya.cat/api/views/b4eh-r8up/rows.csv?accessType=DOWNLOAD
2. `node scripts/importar-festivos.js festes.csv 2027 > data/locales-2027.json`
3. Revisar el informe que imprime: filas de prueba descartadas, municipios con un número de festivos distinto de 2, municipios que faltan.
4. Contrastar con la orden del DOGC una muestra de municipios y todos los avisos del informe.
5. Incorporar el año a `data/calendario.json` (clave `locales["2027"]`) y añadir el año a `ANIOS` si hace falta.
6. Añadir a `generales` los festivos estatales y autonómicos del año siguiente, con nombre en `ca` y `es`.

## Estado de los datos (20/10/2026)

- Festivos generales 2026 y 2027: cargados. 2027 pendiente de contrastar con la orden del DOGC.
- Festivos locales 2026: 870 municipios del dataset abierto. **Faltan 77 municipios** que sí aparecían en 2025 (entre ellos Cerdanyola del Vallès y Viladecans). Hay que completarlos desde la Ordre EMT/208/2025 (DOGC 9565, 17/12/2025) y su modificación (Ordre EMT/3/2026).
- Sitges figura con un solo festivo local en 2026: pendiente de verificar.
- Festivos locales 2027: pendientes de publicación.
