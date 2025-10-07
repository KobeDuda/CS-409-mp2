export function formatPokemonName(rawName: string): string {
  // Try to extract form (e.g. mega, gmax, alola)
  const name = rawName.toLowerCase();

  const forms = ["mega", "gmax", "alola", "galar", "hisui", "paldea", "totem"];
  for (const form of forms) {
    if (name.includes(`-${form}`)) {
      const base = name.replace(`-${form}`, "");
      return `${capitalize(form)} ${capitalizeWords(base)}`;
    }
  }

  // Otherwise just prettify normally
  return capitalizeWords(name);
}

function capitalizeWords(str: string): string {
  return str
    .split(/[-\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}