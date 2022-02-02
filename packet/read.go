package packet

// See https://github.com/Tnze/go-mc
// See https://wiki.vg/Protocol

import (
	"compress/zlib"
	"fmt"
	"io"
)

func (pk *Packet) ReadFrom(reader io.Reader, threshold int) error {
	if threshold >= 0 {
		return pk.readWithCompression(reader, threshold)
	}

	return pk.readWithoutCompression(reader)
}

// See https://wiki.vg/Protocol#Without_compression
func (pk *Packet) readWithoutCompression(reader io.Reader) error {
	packetLength, err := readVarInt(reader)
	if err != nil {
		return err
	}

	return pk.readIdAndData(reader, int(packetLength))
}

// See https://wiki.vg/Protocol#With_compression
func (pk *Packet) readWithCompression(reader io.Reader, threshold int) error {
	packetLength, err := readVarInt(reader)
	if err != nil {
		return err
	}

	dataLength, n, err := readVarIntWithLength(reader)
	if err != nil {
		return err
	}

	// not compressed?
	if dataLength == 0 {
		return pk.readIdAndData(reader, int(packetLength)-n)
	}

	if int(dataLength) < threshold {
		return fmt.Errorf("Compressed packet size %d is too low for threshold %d", dataLength, threshold)
	}

	zr, err := zlib.NewReader(reader)
	if err != nil {
		return err
	}

	defer zr.Close()

	return pk.readIdAndData(zr, int(dataLength))
}

func (pk *Packet) readIdAndData(reader io.Reader, length int) error {
	id, n, err := readVarIntWithLength(reader)
	if err != nil {
		return err
	}

	pk.Id = id
	pk.Data = make([]byte, length-n)

	_, err = io.ReadFull(reader, pk.Data)
	if err != nil {
		return err
	}

	return nil
}
