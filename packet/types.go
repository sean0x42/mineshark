package packet

import (
	"errors"
	"io"
	"log"
)

// See https://wiki.vg/Protocol#Data_types

type Byte byte
type VarInt int32

func readByte(reader io.Reader) (byte, error) {
	var buffer [1]byte
	_, err := io.ReadFull(reader, buffer[:])
	return buffer[0], err
}

func readVarInt(reader io.Reader) (VarInt, error) {
	value, _, err := readVarIntWithLength(reader)
	return value, err
}

// TODO write unit tests
func readVarIntWithLength(reader io.Reader) (VarInt, int, error) {
	var value int32 = 0
	var current byte
	var err error
	length := 0

	for {
		if length == 5 {
			return VarInt(value), length, errors.New("VarInt excees maximum length")
		}

		current, err = readByte(reader)
		if err != nil {
			log.Fatalf("Failed to read byte: %s", err)
		}

		value |= int32((current & 0b01111111) << (length * 7))
		length += 1

		if (current & 0b10000000) == 0 {
			break
		}
	}

	return VarInt(value), length, nil
}
