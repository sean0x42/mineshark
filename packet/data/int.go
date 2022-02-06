package data

import "io"

type Int int32

func (int *Int) ReadFrom(reader io.Reader) (int64, error) {
	var buffer [4]byte

	n, err := io.ReadFull(reader, buffer[:])
	if err != nil {
		return int64(n), err
	}

	*int = Int(int32(buffer[0])<<24 | int32(buffer[1])<<16 | int32(buffer[2])<<8 | int32(buffer[3]))

	return int64(n), nil
}

func (int Int) WriteTo(writer io.Writer) (int64, error) {
	asuint := uint32(int)
	length, err := writer.Write([]byte{
		byte(asuint >> 24),
		byte(asuint >> 16),
		byte(asuint >> 8),
		byte(asuint),
	})
	return int64(length), err
}
