package data

import (
	"errors"
	"io"
)

type VarInt int32

func (varint *VarInt) ReadFrom(reader io.Reader) (int64, error) {
	var value int32 = 0
	var current byte
	var err error
	var length int64 = 0

	for {
		if length == 5 {
			return length, errors.New("VarInt excees maximum length")
		}

		current, err = readByte(reader)
		if err != nil {
			return length, err
		}

		value |= int32((current & 0b01111111) << (length * 7))
		length += 1

		if (current & 0b10000000) == 0 {
			break
		}
	}

	*varint = VarInt(value)
	return length, nil
}

func (varint VarInt) WriteTo(writer io.Writer) (int64, error) {
	val := int32(varint)
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
	return int64(n), err
}
