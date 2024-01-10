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