package data

import "io"

type Boolean bool

func (bool *Boolean) ReadFrom(reader io.Reader) (int64, error) {
	byte, err := readByte(reader)
	if err != nil {
		return 1, err
	}

	*bool = byte != 0
	return 1, nil
}

func (bool Boolean) WriteTo(writer io.Writer) (int64, error) {
	var b byte

	if bool {
		b = 0x1
	} else {
		b = 0x0
	}

	n, err := writer.Write([]byte{b})
	return int64(n), err
}
