package packet

import (
	"errors"
	"io"
)

// See https://wiki.vg/Protocol#Data_types
// TODO write unit tests

type Byte byte
type VarInt int32

func readByte(reader io.Reader) (byte, error) {
	var buffer [1]byte
	_, err := io.ReadFull(reader, buffer[:])
	return buffer[0], err
}

func writeByte(writer io.Writer, value Byte) (int, error) {
	n, err := writer.Write([]byte{byte(value)})
	return n, err
}

func readVarInt(reader io.Reader) (VarInt, error) {
	value, _, err := readVarIntWithLength(reader)
	return value, err
}

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
			return VarInt(value), length, err
		}

		value |= int32((current & 0b01111111) << (length * 7))
		length += 1

		if (current & 0b10000000) == 0 {
			break
		}
	}

	return VarInt(value), length, nil
}

func writeVarInt(writer io.Writer, value VarInt) (int, error) {
	val := int32(value)
	var buffer = make([]byte, 0, 7)

	for {
		currentByte := val & 0b01111111

		val >>= 7
		if val != 0 {
			currentByte |= 0b10000000
		}

		buffer = append(buffer, byte(currentByte))

		if val == 0 {
			break
		}

	}

	n, err := writer.Write(buffer)
	return n, err
}
