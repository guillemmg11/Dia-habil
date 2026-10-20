// Utilidades de fechas sin zona horaria: todas las fechas son cadenas "YYYY-MM-DD".
// Se trabaja en UTC para evitar desplazamientos por horario de verano.

export function parse(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw new Error(`Fecha no válida: ${iso}`);
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) {
    throw new Error(`Fecha inexistente: ${iso}`);
  }
  return date;
}

export function format(date) {
  return date.toISOString().slice(0, 10);
}

export function sumarDias(iso, n) {
  const d = parse(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return format(d);
}

/** 0 = domingo ... 6 = sábado */
export function diaSemana(iso) {
  return parse(iso).getUTCDay();
}

export function ultimoDiaDelMes(y, m /* 1-12 */) {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/**
 * Suma meses "de fecha a fecha" (art. 30.4 Ley 39/2015): el plazo concluye el mismo
 * día del mes de vencimiento en que se produjo la notificación; si en ese mes no existe
 * ese día, concluye el último día del mes.
 */
export function sumarMeses(iso, n) {
  const [y, m, d] = iso.split('-').map(Number);
  const total = (m - 1) + n;
  const y2 = y + Math.floor(total / 12);
  const m2 = (total % 12) + 1;
  const d2 = Math.min(d, ultimoDiaDelMes(y2, m2));
  return `${y2}-${String(m2).padStart(2, '0')}-${String(d2).padStart(2, '0')}`;
}

export function anio(iso) {
  return Number(iso.slice(0, 4));
}
