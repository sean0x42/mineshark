import parseCommand from "./parser";

describe("parseCommand", () => {
  it("should parse a normal command", () => {
    // Given
    const command = "/message sean0x42 Hello world!";

    // When
    const parsedArgs = parseCommand(command);

    // Then
    expect(parsedArgs).toEqual(["/message", "sean0x42", "Hello", "world!"]);
  });

  it("should respect quotation marks", () => {
    // Given
    const command = `/message sean0x42 "Hello world!"`;

    // When
    const parsedArgs = parseCommand(command);

    // Then
    expect(parsedArgs).toEqual(["/message", "sean0x42", "Hello world!"]);
  });

  it("should remove at most one space between words", () => {
    // Given
    const command = `/message sean0x42        Hello     world`;

    // When
    const parsedArgs = parseCommand(command);

    // Then
    expect(parsedArgs).toEqual([
      "/message",
      "sean0x42",
      "       Hello",
      "    world",
    ]);
  });
});
