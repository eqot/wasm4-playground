export function convertImageFromBase64(imageBase64: string): Uint8Array {
  const binary = atob(imageBase64.replace(/.+,/, ""));
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  return array;
}
