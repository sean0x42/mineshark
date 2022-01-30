package packet

import (
	"compress/zlib"
	"fmt"
	"io"
	"log"
)

type Packet struct {
	Id        VarInt
	Data      []byte
	recipient string
	sender    string
}

func New(recipient string, sender string) Packet {
	return Packet{recipient: recipient, sender: sender}
}

func (packet *Packet) Read(reader io.Reader, threshold int) error {
	log.Println("Attempting to read packet...")
	packetLength, err := readVarInt(reader)
	if err != nil {
		return err
	}

	if threshold > 0 {
		dataLength, err := readVarInt(reader)
		if err != nil {
			return err
		}

		if int(dataLength) < threshold {
			return fmt.Errorf("Compressed packet size %d is too low for threshold %d", dataLength, threshold)
		}

		zr, err := zlib.NewReader(reader)
		if err != nil {
			return err
		}

		defer zr.Close()

		return packet.readPacketIdAndData(zr, int(dataLength))
	}

	return packet.readPacketIdAndData(reader, int(packetLength))
}

func (packet *Packet) readPacketIdAndData(reader io.Reader, length int) error {
	packetId, packetIdLen, err := readVarIntWithLength(reader)
	if err != nil {
		return err
	}

	packet.Id = packetId
	packet.Data = make([]byte, length-packetIdLen)
	_, err = io.ReadFull(reader, packet.Data)
	if err != nil {
		log.Printf("Error reading data %s\n", err)
		return err
	}

	return nil
}
