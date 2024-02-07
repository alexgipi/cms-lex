export function createSlug(collectionName) {
    // Reemplazar espacios con guiones y convertir a minúsculas (Slug)
    return collectionName.replace(/\s+/g, '-').toLowerCase();
}

export function capitalizeFirstLetter(cadena) {
    return cadena.substring(0, 1).toUpperCase() + cadena.substring(1);
}

export function slugify(str) {
    return String(str)
      .normalize('NFKD') // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // remove consecutive hyphens
}

export function formatOrderNumber(number, length) {
    return String(number).padStart(length, "0");
}

export function formatCurrency(number) {
    return number.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    });
}

export function formatDate(dateString) { // date: '2023-12-11T05:22:32.977Z'

    const date = new Date(dateString);
  
    const dateFormat = new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'UTC', // Ajusta esto según tu zona horaria
    });
  
    return dateFormat.format(date);
}