package data

import "io"

type (
	Short         int16
	UnsignedShort uint16
)

func (short *Short) ReadFrom(reader io.Reader) (int64, error) {
	var buffer [2]byte

	n, err := io.ReadFull(reader, buffer[:])
	if err != nil {
		return int64(n), err
	}

	*short = Short(int16(buffer[0])<<8 | int16(buffer[1]))

	return int64(n), nil
}

func (short Short) WriteTo(writer io.Writer) (int64, error) {
	asuint := uint16(short)
	length, err := writer.Write([]byte{byte(asuint >> 8), byte(asuint)})
	return int64(length), err
}

func (ushort *UnsignedShort) ReadFrom(reader io.Reader) (int64, error) {
	var buffer [2]byte

	length, err := io.ReadFull(reader, buffer[:])
	if err != nil {
		return int64(length), err
	}

	*ushort = UnsignedShort(int16(buffer[0])<<8 | int16(buffer[1]))

	return int64(length), nil
}

func (ushort UnsignedShort) WriteTo(writer io.Writer) (int64, error) {
	asuint := uint16(ushort)
	length, err := writer.Write([]byte{byte(asuint >> 8), byte(asuint)})
	return int64(length), err
}
