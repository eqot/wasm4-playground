/**
 * Downloads the given data as a file with the specified filename and MIME type.
 *
 * @param data - The data to be downloaded, either as a Uint8Array or a Blob.
 * @param filename - The name of the file to be downloaded.
 * @param mimeType - The MIME type of the file.
 */
export function download(data: Uint8Array | Blob, filename: string, mimeType: string): void {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  downloadURL(url, filename);
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}

/**
 * Downloads a file from a given URL.
 *
 * @param data - The URL of the file to be downloaded.
 * @param filename - The name of the downloaded file.
 */
export function downloadURL(data: string, filename: string): void {
  const a = document.createElement("a") as HTMLAnchorElement;
  a.href = data;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Opens a file picker dialog and returns the selected file as an ArrayBuffer.
 * Only files with the ".png" extension are allowed to be selected.
 *
 * @returns A Promise that resolves to the selected file as an ArrayBuffer, or undefined if no file is selected.
 */
export async function openFile(): Promise<ArrayBuffer | undefined> {
  let files: any;
  try {
    // @ts-ignore
    files = await showOpenFilePicker({ types: [{ accept: { "image/*": [".png"] } }] });
  } catch (e) {
    console.warn(e);
  }
  if (!files) return;

  const file = await files[0].getFile();
  return file;
}

/**
 * Reads the contents of a File object and returns it as an ArrayBuffer.
 * @param file The File object to read.
 * @returns A Promise that resolves with the ArrayBuffer containing the file's contents.
 */
export async function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      }
    };

    reader.readAsArrayBuffer(file);
  });
}
