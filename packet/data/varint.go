package data

import (
	"errors"
	"io"
)

type VarInt int32

func (varint *VarInt) ReadFrom(reader io.Reader) (n int64, err error) {
	var value uint32

	for sec := byte(0x80); sec&0x80 != 0; n++ {
		if n > 5 {
			return n, errors.New("VarInt is too big")
		}

		sec, err = readByte(reader)
		if err != nil {
			return n, err
		}

		value |= uint32(sec&0x7F) << uint32(7*n)
	}

	*varint = VarInt(value)
	return n, err
}

func (varint VarInt) WriteTo(writer io.Writer) (int64, error) {
	var buffer = make([]byte, 0, 5)
	num := uint32(varint)

	for {
		currentByte := num & 0x7F
		num >>= 7

		if num != 0 {
			currentByte |= 0x80
		}

		buffer = append(buffer, byte(currentByte))

		if num == 0 {
			break
		}
	}

	nn, err := writer.Write(buffer)
	return int64(nn), err
}
