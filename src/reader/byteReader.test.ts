import ByteReader from "./byteReader";

describe("ByteReader", () => {
  describe("popByte", () => {
    it("should pop bytes from the buffer one at a time", () => {
      const buffer = Buffer.from([0, 1, 3]);
      const reader = new ByteReader(buffer);

      expect(reader.popByte()).toBe(0);
      expect(reader.popByte()).toBe(1);
      expect(reader.popByte()).toBe(3);
    });
  });

  describe("isFinishedReading", () => {
    it("should return true when finished reading the buffer", () => {
      const buffer = Buffer.from([0, 1]);
      const reader = new ByteReader(buffer);

      expect(reader.isFinishedReading()).toBe(false);
      reader.popByte();
      reader.popByte();
      expect(reader.isFinishedReading()).toBe(true);
    });
  });
});
