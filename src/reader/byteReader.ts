export default class ByteReader {
  protected cursor = 0;
  protected buffer: Buffer;

  constructor(buffer: Buffer) {
    this.buffer = buffer;
  }

  protected peekByte(): number {
    return this.buffer[this.cursor];
  }

  protected popByte(): number {
    return this.buffer[this.cursor++];
  }

  public isFinishedReading(): boolean {
    return this.cursor >= this.buffer.length;
  }
}
