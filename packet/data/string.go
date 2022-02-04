package data

import "io"

type String string

func (string *String) ReadFrom(reader io.Reader) (n int64, err error) {
	var length VarInt

	nl, err := length.ReadFrom(reader)
	if err != nil {
		return nl, err
	}

	n += nl

	buffer := make([]byte, length)
	if _, err := io.ReadFull(reader, buffer); err != nil {
		return n, err
	}

	n += int64(length)

	*string = String(buffer)
	return n, nil
}

func (string String) WriteTo(writer io.Writer) (int64, error) {
	asBytes := []byte(string)

	n1, err := VarInt(len(asBytes)).WriteTo(writer)
	if err != nil {
		return n1, err
	}

	n2, err := writer.Write(asBytes)
	return n1 + int64(n2), err
}
