export default class ByteWriter {
  protected buffer = Buffer.allocUnsafe(0);
  protected length = 0;

  protected push(buffer: Buffer): void {
    this.buffer = Buffer.concat([this.buffer, buffer]);
    this.length += buffer.length;
  }
}
