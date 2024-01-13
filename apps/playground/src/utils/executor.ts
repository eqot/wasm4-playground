let lazyTimer: any = null;

/**
 * Executes a callback function after a specified duration of time.
 * @param callback The callback function to be executed.
 * @param duration The duration of time in milliseconds before executing the callback.
 */
export function lazyExecution(callback: () => void, duration: number): void {
  if (lazyTimer) clearTimeout(lazyTimer);

  lazyTimer = setTimeout(() => callback(), duration);
}
