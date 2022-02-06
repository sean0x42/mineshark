package packet

// See https://github.com/Tnze/go-mc
// See https://wiki.vg/Protocol

import (
	"compress/zlib"
	"fmt"
	"io"

	"github.com/sean0x42/mineshark/packet/data"
	log "github.com/sirupsen/logrus"
)

func (pk *Packet) ReadFrom(reader io.Reader, threshold *int) error {
	// Block on read packet length.
	// This prevents the value of threshold from becoming stale. We can read it only once we have data.
	var packetLength data.VarInt
	_, err := packetLength.ReadFrom(reader)
	if err != nil {
		return err
	}

	if *threshold >= 0 {
		return pk.readWithCompression(reader, packetLength, *threshold)
	}

	return pk.readWithoutCompression(reader, packetLength)
}

// See https://wiki.vg/Protocol#Without_compression
func (pk *Packet) readWithoutCompression(reader io.Reader, packetLength data.VarInt) error {
	return pk.readIdAndData(reader, int64(packetLength))
}

// See https://wiki.vg/Protocol#With_compression
func (pk *Packet) readWithCompression(reader io.Reader, packetLength data.VarInt, threshold int) error {
	var dataLength data.VarInt
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

	log.Debugf("Reading compressed packet with length %d", dataLength)
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
