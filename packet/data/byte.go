package data

import "io"

type Byte byte

func readByte(reader io.Reader) (byte, error) {
	var buffer [1]byte
	_, err := io.ReadFull(reader, buffer[:])
	return buffer[0], err
}

func writeByte(writer io.Writer, value Byte) (int, error) {
	n, err := writer.Write([]byte{byte(value)})
	return n, err
}
