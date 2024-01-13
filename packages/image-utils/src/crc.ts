const crcTable: number[] = [];
const initialCrc = 0xffffffff;

/**
 * Calculates the CRC (Cyclic Redundancy Check) value for the given data.
 * @param data - The data for which to calculate the CRC.
 * @returns The CRC value.
 */
export function getCrc(data: number[]): number {
  return (updateCrc(initialCrc, data) ^ initialCrc) >>> 0;
}

function updateCrc(crc: number, data: number[]): number {
  data.forEach((value) => (crc = crcTable[(crc ^ value) & 0xff]! ^ (crc >>> 8)));
  return crc;
}

function initializeCrcTable(): void {
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable.push(c);
  }
}
if (crcTable.length === 0) {
  initializeCrcTable();
}
