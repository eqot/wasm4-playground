import { getCrc } from "./crc";

const PNG_HEADER = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const ChunkType = {
  TEXT: "tEXt",
  IEND: "IEND",
};

type Chunk = {
  type: string;
  length: number;
  data: number[];
};

/**
 * Extracts texts from an image in PNG format.
 * @param image - The image data in the form of an ArrayBuffer.
 * @returns An array of strings representing the extracted texts from the image, or undefined if the image is not in PNG format.
 */
export function getTextsFromImage(image: ArrayBuffer): string[] | undefined {
  const input = new Uint8Array(image, 0, image.byteLength);
  const output: string[] = [];
  let index = 0;

  // Check if the image has a PNG header
  const length = isMatch(input, index, PNG_HEADER);
  if (!length) return;
  index += length;

  let chunk;
  do {
    chunk = readChunk(input, index);
    if (!chunk) break;

    if (chunk.type === ChunkType.TEXT) {
      const data = chunk.data.slice(8, chunk.length - 4);
      const text = decodeURIComponent(atob(String.fromCharCode(...data)));
      output.push(text);
    }

    index += chunk.length;
  } while (chunk.type !== ChunkType.IEND);

  return output;
}

/**
 * Injects text into an image by modifying the PNG chunks.
 *
 * @param buffer - The image buffer as an ArrayBuffer.
 * @param text - The text to be injected into the image.
 * @returns The modified image buffer as a Uint8Array, or undefined if the image is not a valid PNG.
 */
export function injectTextIntoImage(buffer: ArrayBuffer, text: string): Uint8Array | undefined {
  const input = new Uint8Array(buffer, 0, buffer.byteLength);
  const output: (number | number[])[] = [];
  let index = 0;

  // Check if the image has a PNG header
  const length = isMatch(input, index, PNG_HEADER);
  if (!length) return;
  index += length;
  output.push(PNG_HEADER);

  let chunk;
  do {
    chunk = readChunk(input, index);
    if (!chunk) break;

    if (chunk.type === ChunkType.IEND) {
      const textChunk = makeTextChunk(text);
      output.push(textChunk);
    }

    output.push(chunk.data);

    index += chunk.length;
  } while (chunk.type !== ChunkType.IEND);

  return Uint8Array.from(output.flat());
}

/**
 * Checks if a target Uint8Array matches a sequence of items starting from a given index.
 * @param target - The target Uint8Array to check.
 * @param index - The starting index in the target Uint8Array.
 * @param items - The sequence of items to match against the target Uint8Array.
 * @returns The length of the matched sequence if it is found, otherwise undefined.
 */
function isMatch(target: Uint8Array, index: number, items: number[]): number | undefined {
  for (let i = 0; i < items.length; i++) {
    if (target[index + i] !== items[i]) {
      return;
    }
  }

  return items.length;
}

/**
 * Reads a chunk from the target Uint8Array at the specified index.
 * @param target The target Uint8Array to read from.
 * @param index The index of the chunk in the target Uint8Array.
 * @returns The Chunk object containing the type, length, and data of the chunk, or undefined if the index is out of range.
 */
function readChunk(target: Uint8Array, index: number): Chunk | undefined {
  if (target.length <= index) return;

  const dataLength = new DataView(target.slice(index, index + 4).buffer).getUint32(0);
  const length = dataLength + 4 * 3;

  const type = String.fromCharCode(...target.slice(index + 4, index + 8));

  return { type, length, data: Array.from(target.slice(index, index + length)) };
}

/**
 * Creates a PNG text chunk from the given text.
 *
 * @param text The text to be encoded as a PNG text chunk.
 * @returns An array of numbers representing the PNG text chunk.
 */
function makeTextChunk(text: string): number[] {
  const data = toCharCode(btoa(encodeURIComponent(text)));
  const crc = getCrc(data);

  return [toHex(data.length), toCharCode(ChunkType.TEXT), data, toHex(crc)].flat();
}

/**
 * Converts a number to its hexadecimal representation.
 * @param value - The number to convert.
 * @returns An array of bytes representing the hexadecimal value.
 */
function toHex(value: number): number[] {
  const view = new DataView(new ArrayBuffer(4));
  view.setUint32(0, value, false);
  return Array.from(new Uint8Array(view.buffer));
}

/**
 * Converts a string to an array of character codes.
 * @param label The string to convert.
 * @returns An array of character codes.
 */
function toCharCode(label: string): number[] {
  return label.split("").map((c) => c.charCodeAt(0));
}
