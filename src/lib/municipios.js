// Nombres y slugs de municipios a partir del formato del dataset ("Hospitalet de Llobregat, l'").

export function nombreVisible(nombre) {
  const m = nombre.match(/^(.*),\s*(el|la|els|les|l')$/i);
  if (!m) return nombre;
  const art = m[2].toLowerCase();
  return art === "l'" ? `L'${m[1]}` : `${art[0].toUpperCase()}${art.slice(1)} ${m[1]}`;
}

export function slug(nombre) {
  return nombreVisible(nombre)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/·/g, '').replace(/'/g, '-')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Lista ordenada [{ codigo, nombre, slug }] con slugs únicos. */
export function listaMunicipios(municipios) {
  const usados = new Map();
  return Object.entries(municipios)
    .map(([codigo, n]) => ({ codigo, nombre: nombreVisible(n) }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'ca'))
    .map((m) => {
      let s = slug(m.nombre);
      if (usados.has(s)) s = `${s}-${m.codigo}`;
      usados.set(s, true);
      return { ...m, slug: s };
    });
}

// Municipios indexados en el lanzamiento: los más poblados de Cataluña (por nombre visible).
// El resto se publica con noindex y se abre por tandas según Search Console.
// scripts/comprobar-indexados.js avisa si algún nombre no existe en los datos.
export const INDEXADOS_NOMBRES = [
  'Barcelona', "L'Hospitalet de Llobregat", 'Terrassa', 'Badalona', 'Sabadell', 'Lleida',
  'Tarragona', 'Mataró', 'Sant Cugat del Vallès', 'Girona', 'Reus', 'Cornellà de Llobregat',
  'Sant Boi de Llobregat', 'Rubí', 'Vilanova i la Geltrú', 'Manresa', 'Mollet del Vallès',
  'El Prat de Llobregat', 'Castelldefels', 'Gavà', 'Sant Feliu de Llobregat', 'Sant Joan Despí',
  'Molins de Rei', 'Esplugues de Llobregat', 'Granollers', 'Vic', 'Igualada', 'Figueres',
  'Blanes', 'Lloret de Mar', 'Sitges', 'Cambrils', 'Salou', 'El Vendrell', 'Tortosa',
  'Sant Adrià de Besòs', 'Ripollet', 'Montcada i Reixac', 'Santa Coloma de Gramenet', 'Olot',
  // Añadidos por interés en Google Trends (octubre 2026) y población.
  'Sant Just Desvern', 'Barberà del Vallès', 'Viladecans', 'Cerdanyola del Vallès',
  // Segunda tanda (28/10/2026): municipios de más de ~15.000 habitantes y los que ya
  // reciben impresiones en Search Console aunque estuvieran en noindex.
  'Vilafranca del Penedès', 'Salt', 'Sant Pere de Ribes', 'Calafell', 'Martorell',
  'Sant Andreu de la Barca', 'Sant Vicenç dels Horts', 'Premià de Mar', 'Pineda de Mar', 'Valls',
  'Santa Perpètua de Mogoda', 'Castellar del Vallès', 'Olesa de Montserrat', 'Palafrugell',
  'Esparreguera', 'El Masnou', 'Sant Feliu de Guíxols', 'Vilassar de Mar', 'Manlleu', 'Amposta',
  'Les Franqueses del Vallès', 'Banyoles', 'Roses', 'Sant Quirze del Vallès', 'Caldes de Montbui',
  'Parets del Vallès', 'Malgrat de Mar', 'Calella', 'Cardedeu', 'Sant Celoni', 'Tordera',
  'Balaguer', 'Berga', 'Torredembarra', 'La Garriga', 'Tàrrega', 'Canovelles', 'Arenys de Mar',
  'Montornès del Vallès', 'Cubelles', 'Mollerussa', 'Palau-solità i Plegamans',
  'Corbera de Llobregat', "Lliçà d'Amunt", 'Torelló', 'Cunit', 'La Ràpita', "Sant Sadurní d'Anoia",
  'La Llagosta', 'Badia del Vallès', 'Abrera', 'Castellbisbal', 'Montgat', "La Seu d'Urgell",
  'Mont-Roig del Camp', 'Deltebre', 'Ripoll', 'Sant Joan de Vilatorrada', 'Pallejà', 'Premià de Dalt',
  'Vielha e Mijaran', 'Puigcerdà', 'Santa Coloma de Farners', 'Sant Andreu de Llavaneres',
];
const indexados = new Set(INDEXADOS_NOMBRES);
export const esIndexado = (m) => indexados.has(m.nombre);

/**
 * Localidades que se pueden elegir en la calculadora: municipios con fiestas propias o sin
 * propuesta, y cada núcleo con fiestas propias ("Raimat (Lleida)"). Los municipios que solo
 * tienen fiestas por núcleo no se ofrecen como tales: hay que elegir el núcleo.
 */
export function listaLocalidades(datos, year = '2026') {
  const estado = datos.estado?.[year] ?? {};
  const out = Object.entries(datos.municipios)
    .filter(([codigo]) => estado[codigo] !== 'solo_nucleos')
    .map(([codigo, n]) => ({ codigo, nombre: nombreVisible(n) }));
  for (const [codigo, n] of Object.entries(datos.nucleos?.[year] ?? {})) {
    out.push({ codigo, nombre: `${nombreVisible(n.nombre)} (${nombreVisible(datos.municipios[n.municipio])})` });
  }
  return out.sort((a, b) => a.nombre.localeCompare(b.nombre, 'ca'));
}
