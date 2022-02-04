package packet

// See https://github.com/Tnze/go-mc
// See https://wiki.vg/Protocol

import (
	"compress/zlib"
	"fmt"
	"io"

	"github.com/sean0x42/mineshark/packet/data"
)

func (pk *Packet) ReadFrom(reader io.Reader, threshold int) error {
	if threshold >= 0 {
		return pk.readWithCompression(reader, threshold)
	}

	return pk.readWithoutCompression(reader)
}

// See https://wiki.vg/Protocol#Without_compression
func (pk *Packet) readWithoutCompression(reader io.Reader) error {
	var packetLength data.VarInt
	_, err := packetLength.ReadFrom(reader)
	if err != nil {
		return err
	}

	return pk.readIdAndData(reader, int64(packetLength))
}

// See https://wiki.vg/Protocol#With_compression
func (pk *Packet) readWithCompression(reader io.Reader, threshold int) error {
	var packetLength data.VarInt
	var dataLength data.VarInt

	_, err := packetLength.ReadFrom(reader)
	if err != nil {
		return err
	}

	n, err := dataLength.ReadFrom(reader)
	if err != nil {
		return err
	}

	// not compressed?
	if dataLength == 0 {
		return pk.readIdAndData(reader, int64(packetLength)-n)
	}

	if int(dataLength) < threshold {
		return fmt.Errorf("Compressed packet size %d is too low for threshold %d", dataLength, threshold)
	}

	zr, err := zlib.NewReader(reader)
	if err != nil {
		return err
	}

	defer zr.Close()

	return pk.readIdAndData(zr, int64(dataLength))
}

func (pk *Packet) readIdAndData(reader io.Reader, length int64) error {
	var packetId data.VarInt

	n, err := packetId.ReadFrom(reader)
	if err != nil {
		return err
	}

	pk.Id = packetId
	pk.Data = make([]byte, length-n)

	_, err = io.ReadFull(reader, pk.Data)
	if err != nil {
		return err
	}

	return nil
}
