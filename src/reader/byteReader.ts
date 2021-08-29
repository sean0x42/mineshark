export default class ByteReader {
  cursor = 0;
  buffer: Buffer;

  constructor(buffer: Buffer) {
    this.buffer = buffer;
  }

  public popByte(): number {
    return this.buffer[this.cursor++];
  }

  public isFinishedReading(): boolean {
    return this.cursor >= this.buffer.length;
  }
}
