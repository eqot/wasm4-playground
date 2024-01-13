// @ts-ignore
import { encode } from "./z85";

let wasm4document: Document;
let wasm4app: any;

/**
 * Retrieves the wasm4-app element from the specified iframe.
 *
 * @param iframe - The HTMLIFrameElement containing the wasm4-app element.
 * @returns The wasm4-app element if found, otherwise undefined.
 */
export function getWasm4app(iframe?: HTMLIFrameElement): any {
  if (!wasm4app) {
    if (!iframe?.contentWindow?.document) return;

    wasm4document = iframe?.contentWindow?.document;
    wasm4app = Array.from(wasm4document.body.children).find((element) => element.localName === "wasm4-app");
  }

  return wasm4app;
}

/**
 * Sets the WebAssembly module.
 *
 * @param wasm - The WebAssembly module.
 */
export async function setWasm(wasm: any): Promise<void> {
  if (!wasm4document || !wasm) return;

  let element = wasm4document.querySelector("#wasm4-cart-json") as HTMLDivElement;
  if (!element) {
    element = wasm4document.createElement("div");
    if (!element) return;

    element.setAttribute("id", "wasm4-cart-json");
    element.style.setProperty("display", "none");
    wasm4document.body.append(element);
  }

  const cart = JSON.stringify({
    WASM4_CART: encode(wasm),
    WASM4_CART_SIZE: wasm.length,
  });
  element.textContent = cart;

  await wasm4app.resetCart(wasm);
}

/**
 * Sets the theme of the wasm4app.
 *
 * @param theme The theme to set. Defaults to "light".
 */
export function setTheme(theme: string = "light"): void {
  if (!wasm4app) return;

  wasm4app.style.setProperty("background-color", theme === "dark" ? "#000" : "#fff");
}
