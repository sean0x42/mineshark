package data

import "io"

type (
	Byte         int8
	UnsignedByte uint8
)

func readByte(reader io.Reader) (byte, error) {
	var buffer [1]byte
	_, err := io.ReadFull(reader, buffer[:])
	return buffer[0], err
}

func (b *Byte) ReadFrom(reader io.Reader) (int64, error) {
	val, err := readByte(reader)
	if err != nil {
		return 1, err
	}

	*b = Byte(val)
	return 1, nil
}

func (b Byte) WriteTo(writer io.Writer) (int64, error) {
	n, err := writer.Write([]byte{byte(b)})
	return int64(n), err
}

func (byte *UnsignedByte) ReadFrom(reader io.Reader) (int64, error) {
	val, err := readByte(reader)
	if err != nil {
		return 1, err
	}

	*byte = UnsignedByte(val)
	return 1, nil
}

func (b UnsignedByte) WriteTo(writer io.Writer) (int64, error) {
	n, err := writer.Write([]byte{byte(b)})
	return int64(n), err
}
