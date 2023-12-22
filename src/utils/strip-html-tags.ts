/**
 * Removes HTML tags from a given input string.
 * @param input - The input string containing HTML tags.
 * @returns The input string without HTML tags.
 */
export function stripHtmlTags(input: string) {
  const withoutTags = input.replaceAll(/<\/?[^>]+(>|$)/g, "");

  return withoutTags;
}
