import { getWasm4app } from "./utils";

const SCREEN_WIDTH = 160;
const SCREEN_HEIGHT = 160;

/**
 * Captures the screen of the Wasm4 runtime and returns it as a data URL.
 * @returns The captured screen as a data URL in PNG format.
 */
export function captureWasm4Screen() {
  const wasm4app = getWasm4app();
  const runtime = wasm4app?.runtime;
  if (!runtime) return;

  runtime.composite();

  const framebuffer = runtime.framebuffer;
  const palette = new Uint32Array(runtime.memory.buffer);
  // console.log(framebuffer);

  const canvas = document.createElement("canvas");
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) return;

  const imageData = context.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
  if (!imageData) return;

  for (let i = 0; i < framebuffer.bytes.length; i++) {
    const value = framebuffer.bytes[i];
    for (let j = 0; j < 4; j++) {
      const colorIndex = (value >> (j * 2)) & 3;
      const color = palette[1 + colorIndex];

      imageData.data[i * 16 + j * 4 + 0] = (color! >> 16) & 0xff;
      imageData.data[i * 16 + j * 4 + 1] = (color! >> 8) & 0xff;
      imageData.data[i * 16 + j * 4 + 2] = (color! >> 0) & 0xff;
      imageData.data[i * 16 + j * 4 + 3] = 0xff;
    }
  }

  context.putImageData(imageData, 0, 0);

  return canvas.toDataURL("image/png");
}

export function requestFullscreen() {
  const wasm4app = getWasm4app();
  wasm4app?.requestFullscreen();
}
