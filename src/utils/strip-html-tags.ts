export function stripHtmlTags(input: string) {
  // Remove HTML tags
  const withoutTags = input.replace(/<\/?[^>]+(>|$)/g, "");

  return withoutTags;
}
