import NbtPacketWriter from "./nbtWriter";
import { NbtTag, NbtType } from "../nbt";
import { PacketKind } from "../packet/types";
import helloWorldNbt from "../reader/__fixtures__/helloWorld.json";
import bigTestNbt from "../reader/__fixtures__/bigTest.json";
import bigTestTag from "./__fixtures__/bigTest";
import Registry, { RegistryEntry } from "../packet/registry";

describe("NbtPacketWriter integration tests", () => {
  beforeEach(() => {
    jest.spyOn(Registry, "getPacketByKind").mockReturnValue({
      id: 0x00,
    } as RegistryEntry);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should serialize the hello_world.nbt test case", () => {
    // Given
    const tag: NbtTag = {
      kind: NbtType.Compound,
      name: "hello world",
      payload: {
        name: {
          kind: NbtType.String,
          name: "name",
          payload: "Bananrama",
        },
      },
    };

    // When
    const writer = new NbtPacketWriter(PacketKind.JoinGame);
    writer.writeNbt(tag);

    const nbtBuffer = writer.toUncompressedPacketBuffer().slice(2);

    // Then
    expect(nbtBuffer.toJSON().data).toEqual(helloWorldNbt);
  });

  it("should serialize the bigtest.nbt test case", () => {
    // Given
    const tag = bigTestTag;

    // When
    const writer = new NbtPacketWriter(PacketKind.JoinGame);
    writer.writeNbt(tag);

    // There should be 3 bytes padding for length (2) + packet id (1)
    const nbtBuffer = writer.toUncompressedPacketBuffer().slice(3);

    // Then
    // We can't just straight compare the two arrays, as property order is not guaranteed to be preserved.
    // Ensure the length looks right, and that snapshot matches
    expect(nbtBuffer.toJSON().data.length).toEqual(bigTestNbt.length);
    expect(nbtBuffer.toJSON().data).toMatchSnapshot();
  });
});
