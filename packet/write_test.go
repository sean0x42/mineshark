package packet

import (
	"bytes"
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
		t.Logf("Failed to write packet: %s", err)
		t.FailNow()
	}

	// Then
	var packetLength data.VarInt
	_, err = packetLength.ReadFrom(&buffer)
	if err != nil {
		t.Logf("Failed to read varint: %s", err)
		t.FailNow()
	}

	// expected length id (1) + data
	if int(packetLength) != 1+len(packet.Data) {
		t.Errorf("Expected packet length %d, found %d", 1+len(packet.Data), packetLength)
	}

	id, err := buffer.ReadByte()
	if err != nil {
		t.Logf("Failed to read byte: %s", err)
		t.FailNow()
	}

	if id != byte(packet.Id) {
		t.Errorf("Expected packet id %d. Found %d", packet.Id, id)
	}

	remaining := buffer.Bytes()
	if !bytes.Equal(remaining, packet.Data) {
		t.Errorf("Expected data %v. Found %v", packet.Data, remaining)
	}
}
