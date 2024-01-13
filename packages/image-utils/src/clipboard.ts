/**
 * Retrieves an image from the clipboard.
 * @returns A Promise that resolves to an ArrayBuffer containing the image data, or undefined if no image is found in the clipboard.
 */
export async function getImageFromClipboard(): Promise<ArrayBuffer | undefined> {
  const items = await navigator.clipboard.read();
  for (const item of items) {
    for (const type of item.types) {
      if (type.startsWith("image/")) {
        const blob = await item.getType(type);
        if (blob) {
          return blob.arrayBuffer();
        }
      }
    }
  }
}
