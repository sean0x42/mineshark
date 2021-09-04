import { NbtType } from "../nbt";
import NbtPacketReader from "./nbtReader";
import helloWorldNbt from "./__fixtures__/helloWorld.json";
import bigTestNbt from "./__fixtures__/bigTest.json";

describe("nbtReader", () => {
  // Note: creates a buffer in the uncompressed format.
  function createDummyBuffer(vals: number[]): Buffer {
    return Buffer.from([0x00, 0x00, ...vals]);
  }

  it("should parse the hello_world.nbt test case", () => {
    // Given
    const packet = createDummyBuffer(helloWorldNbt);

    // When
    const reader = new NbtPacketReader(packet);
    const nbt = reader.readNbtCompound();

    // Then
    expect(nbt).toEqual({
      kind: NbtType.Compound,
      name: "hello world",
      payload: {
        name: {
          kind: NbtType.String,
          name: "name",
          payload: "Bananrama",
        },
      },
    });
  });

  it("should parse the bigtest.nbt test case", () => {
    // Given
    const packet = createDummyBuffer(bigTestNbt);

    // When
    const reader = new NbtPacketReader(packet);
    const nbt = reader.readNbtCompound();

    // Then
    expect(nbt).toMatchSnapshot();
  });
});
