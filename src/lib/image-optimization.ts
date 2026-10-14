export function canOptimizeImage(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname === "images.unsplash.com";
  } catch {
    return false;
  }
}
