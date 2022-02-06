package packet

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"testing"

	"github.com/sean0x42/mineshark/packet/data"
)

func TestReadWithoutCompression(t *testing.T) {
	// Given
	setCompressionBytes := []byte{0x03, 0x03, 0x80, 0x02}
	packet := Packet{}
	reader := bytes.NewReader(setCompressionBytes)
	threshold := -1

	// When
	err := packet.ReadFrom(reader, &threshold)
	if err != nil {
		t.Fatalf("Error when reading without compression: %s", err)
	}

	// Then
	if packet.Id != data.VarInt(setCompressionBytes[1]) {
		t.Errorf("Expected packet ID %x, found %x", setCompressionBytes[1], packet.Id)
	}

	if !bytes.Equal(packet.Data, setCompressionBytes[2:]) {
		t.Errorf("Expected packet data %v\nFound %v", setCompressionBytes[2:], packet.Data)
	}
}

func TestReadWithCompressionWhenDataLengthIsZero(t *testing.T) {
	// Given
	someBytes := []byte{0x1b, 0x00, 0x02, 0xf3, 0x71, 0xe4, 0x5d, 0xf2, 0x02, 0x39, 0x22, 0x80, 0xc5, 0xd9, 0x05, 0x58, 0xd2, 0xc5, 0xda, 0x08, 0x73, 0x65, 0x61, 0x6e, 0x30, 0x78, 0x34, 0x32}
	packet := Packet{}
	reader := bytes.NewReader(someBytes)
	threshold := 256

	// When
	err := packet.ReadFrom(reader, &threshold)
	if err != nil {
		t.Fatalf("Error: %S", err)
	}

	// Then
	if packet.Id != data.VarInt(someBytes[2]) {
		t.Errorf("Expected packet ID %x, found %x", someBytes[2], packet.Id)
	}

	if !bytes.Equal(packet.Data, someBytes[3:]) {
		t.Errorf("Expected packet data %v\nFound %v", someBytes[3:], packet.Data)
	}
}

func TestReadWithCompression(t *testing.T) {
	// Given
	content, err := ioutil.ReadFile("./from_writer.json")
	if err != nil {
		t.Fatalf("Error reading compressed packet test fixture: %s", err)
	}

	var compressedBytes []byte
	err = json.Unmarshal(content, &compressedBytes)
	if err != nil {
		t.Fatalf("Error parsing JSON to byte array: %s", err)
	}

	packet := Packet{}
	reader := bytes.NewReader(compressedBytes)
	threshold := 256

	// When
	err = packet.ReadFrom(reader, &threshold)
	if err != nil {
		t.Fatalf("Error reading packet: %s", err)
	}

	// Then
	if packet.Id != JoinGame {
		t.Errorf("Expected packet ID %d. Found %d", JoinGame, packet.Id)
	}

	var (
		entityId     data.Int
		isHardcore   data.Boolean
		gamemode     data.UnsignedByte
		prevGamemode data.Byte
		worldCount   data.VarInt
		dimension1   data.String
		dimension2   data.String
		dimension3   data.String
	)
	packet.Extract(&entityId, &isHardcore, &gamemode, &prevGamemode, &worldCount, &dimension1, &dimension2, &dimension3)

	t.Logf("Entity id %d", entityId)
	t.Logf("Is hardcore %v", isHardcore)
	t.Logf("Gamemode %d", gamemode)
	t.Logf("Prev Gamemode %d", prevGamemode)
	t.Logf("World count %d", worldCount)
	t.Logf("Dimensions %s, %s, %s", dimension1, dimension2, dimension3)
	// TODO assert the above

	// t.Logf("%v", packet.Data)
}
