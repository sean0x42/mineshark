package packet

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"testing"

	"github.com/sean0x42/mineshark/packet/data"
)

func TestWriteWithoutCompression(t *testing.T) {
	// Given
	packet := Packet{
		Id:   data.VarInt(0x0),
		Data: []byte{10, 20, 30, 40, 50, 60, 70, 80},
	}

	var buffer bytes.Buffer

	// When
	err := packet.writeWithoutCompression(&buffer)
	if err != nil {
		t.Fatalf("Failed to write packet: %s", err)
	}

	// Then
	var packetLength data.VarInt
	_, err = packetLength.ReadFrom(&buffer)
	if err != nil {
		t.Fatalf("Failed to read varint: %s", err)
	}

	// expected length id (1) + data
	if int(packetLength) != 1+len(packet.Data) {
		t.Errorf("Expected packet length %d, found %d", 1+len(packet.Data), packetLength)
	}

	id, err := buffer.ReadByte()
	if err != nil {
		t.Fatalf("Failed to read byte: %s", err)
	}

	if id != byte(packet.Id) {
		t.Errorf("Expected packet id %d. Found %d", packet.Id, id)
	}

	remaining := buffer.Bytes()
	if !bytes.Equal(remaining, packet.Data) {
		t.Errorf("Expected data %v. Found %v", packet.Data, remaining)
	}
}

func TestWriteWithCompressionPacketLengthIsBelowThreshold(t *testing.T) {
	// Given
	packet := Packet{
		Id:   data.VarInt(0x02),
		Data: []byte{0xf3, 0x71, 0xe4, 0x5d, 0xf2, 0x02, 0x39, 0x22, 0x80, 0xc5, 0xd9, 0x05, 0x58, 0xd2, 0xc5, 0xda, 0x08, 0x73, 0x65, 0x61, 0x6e, 0x30, 0x78, 0x34, 0x32},
	}
	// 2 extra bytes to account for packet id and data length
	expectedPacketLength := 2 + len(packet.Data)
	expectedDataLength := 0

	var buffer bytes.Buffer

	// When
	err := packet.writeWithCompression(&buffer, 256)
	if err != nil {
		t.Fatalf("Err: %s", err)
	}

	// Then
	packetLength, err := buffer.ReadByte()
	if err != nil {
		t.Fatalf("Failed to read byte from buffer: %s", err)
	}

	if packetLength != byte(expectedPacketLength) {
		t.Errorf("Expected packet length %d. Found %d", expectedPacketLength, packetLength)
	}

	dataLength, err := buffer.ReadByte()
	if err != nil {
		t.Fatalf("Failed to read byte from buffer: %s", err)
	}

	if dataLength != byte(expectedDataLength) {
		t.Errorf("Expected data length %d. Found %d", expectedDataLength, dataLength)
	}

	packetId, err := buffer.ReadByte()
	if err != nil {
		t.Fatalf("Failed to read byte from buffer: %s", err)
	}

	if packetId != byte(packet.Id) {
		t.Errorf("Expected packet id %d. Found %d", packet.Id, packetId)
	}

	remaining := buffer.Bytes()
	if !bytes.Equal(remaining, packet.Data) {
		t.Errorf("Expected bytes %v\nFound %v", packet.Data, remaining)
	}
}

func TestWriteWithCompression(t *testing.T) {
	// Given
	compressedRaw, err := ioutil.ReadFile("./compressed_packet_test_data.json")
	if err != nil {
		t.Fatalf("Error reading compressed packet test fixture: %s", err)
	}

	var compressedBytes []byte
	err = json.Unmarshal(compressedRaw, &compressedBytes)
	if err != nil {
		t.Fatalf("Error parsing JSON to byte array: %s", err)
	}

	uncompressedRaw, err := ioutil.ReadFile("./uncompressed_packet_test_data.json")
	if err != nil {
		t.Fatalf("Error reading uncompressed packet test fixture: %s", err)
	}

	var uncompressedBytes []byte
	err = json.Unmarshal(uncompressedRaw, &uncompressedBytes)
	if err != nil {
		t.Fatalf("Error parsing JSON to byte array: %s", err)
	}

	packet := Packet{
		Id:   JoinGame,
		Data: uncompressedBytes,
	}
	threshold := 256
	var buffer bytes.Buffer

	// When
	err = packet.writeWithCompression(&buffer, threshold)
	if err != nil {
		t.Fatalf("Error writing packet: %s", err)
	}

	// Then
	if !bytes.Equal(buffer.Bytes(), compressedBytes) {
		t.Logf("Expected length %d. Actual length %d", len(compressedBytes), buffer.Len())
		t.Error("Compressed bytes do not match written bytes.")
	}
}
