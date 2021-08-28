import PacketReader from "./reader";

describe("PacketReader", () => {
  it("should read strings", () => {
    // Given
    const buffer = Buffer.from([
      0x14, 0x00, 0x0d, 0x31, 0x39, 0x32, 0x2e, 0x31, 0x36, 0x38, 0x2e, 0x32,
      0x30, 0x2e, 0x33, 0x31,
    ]);
    const reader = new PacketReader(buffer);

    // When
    const value = reader.readString();

    // Then
    expect(value).toBe("192.168.20.31");
  });

  it("should read variable ints", () => {
    // Given
    const buffer = Buffer.from([0x04, 0x00, 0xf4, 0x05]);
    const reader = new PacketReader(buffer);

    // When
    const value = reader.readVarInt();

    // Then
    expect(value).toBe(756);
  });

  it("should read unsigned shorts", () => {
    // Given
    const buffer = Buffer.from([0x04, 0x00, 0x63, 0xde]);
    const reader = new PacketReader(buffer);

    // When
    const value = reader.readUnsignedShort();

    // Then
    expect(value).toBe(25566);
  });

  // TODO fix this test
  it.skip("should read longs", () => {
    // Given
    const buffer = Buffer.from([
      0x14, 0x00, 0xf4, 0x05, 0x0d, 0x31, 0x39, 0x32, 0x2e, 0x31,
    ]);
    const reader = new PacketReader(buffer);

    // When
    const value = reader.readLong();

    // Then
    expect(value).toBe(10);
  });

  it("should read an entire status packet", () => {
    // Given
    const buffer = Buffer.from([
      0x14, 0x00, 0xf4, 0x05, 0x0d, 0x31, 0x39, 0x32, 0x2e, 0x31, 0x36, 0x38,
      0x2e, 0x32, 0x30, 0x2e, 0x33, 0x31, 0x63, 0xde, 0x01,
    ]);
    const reader = new PacketReader(buffer);

    // When
    const protocolVersion = reader.readVarInt();
    const host = reader.readString();
    const port = reader.readUnsignedShort();
    const nextState = reader.readVarInt();
    const isFinished = reader.isFinishedReading();

    // Then
    expect(protocolVersion).toBe(756);
    expect(host).toBe("192.168.20.31");
    expect(port).toBe(25566);
    expect(nextState).toBe(1);
    expect(isFinished).toBe(true);
  });
});
