import { getWasm4app } from "./utils";

export function saveGameState() {
  const wasm4app = getWasm4app();
  wasm4app?.saveGameState();
}

export function loadGameState() {
  const wasm4app = getWasm4app();
  wasm4app?.loadGameState();
}
