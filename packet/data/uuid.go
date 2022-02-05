package data

import (
	"io"

	"github.com/google/uuid"
)

type UUID uuid.UUID

func (id *UUID) ReadFrom(reader io.Reader) (int64, error) {
	n, err := io.ReadFull(reader, (*id)[:])
	return int64(n), err
}

func (id UUID) WriteTo(writer io.Writer) (int64, error) {
	n, err := writer.Write(id[:])
	return int64(n), err
}
