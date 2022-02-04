package packet

// See https://github.com/Tnze/go-mc
// See https://wiki.vg/Protocol

import (
	"bytes"
	"compress/zlib"
	"io"

	"github.com/sean0x42/mineshark/packet/data"
)

func (pk *Packet) writeIdAndData(writer io.Writer) (int64, error) {
	n1, err := pk.Id.WriteTo(writer)
	if err != nil {
		return n1, err
	}

	n2, err := writer.Write(pk.Data)
	if err != nil {
		return n1 + int64(n2), err
	}

	return n1 + int64(n2), nil
}

func (pk *Packet) WriteTo(writer io.Writer, threshold int) error {
	if threshold >= 0 {
		return pk.writeWithCompression(writer, threshold)
	}

	return pk.writeWithoutCompression(writer)
}

// See https://wiki.vg/Protocol#Without_compression
func (pk *Packet) writeWithoutCompression(writer io.Writer) error {
	// Will contain: id + data
	var buffer bytes.Buffer

	_, err := pk.writeIdAndData(&buffer)
	if err != nil {
		return err
	}

	_, err = data.VarInt(buffer.Len()).WriteTo(writer)
	if err != nil {
		return err
	}

	_, err = buffer.WriteTo(writer)
	if err != nil {
		return err
	}

	return nil
}

// See https://wiki.vg/Protocol#With_compression
func (pk *Packet) writeWithCompression(writer io.Writer, threshold int) error {
	// Will contain: uncompressed len + id + data
	var buffer bytes.Buffer
	var err error

	if len(pk.Data) < threshold {
		// data length
		// 0 = no compression
		_, err = data.VarInt(0).WriteTo(&buffer)
		if err != nil {
			return err
		}

		_, err = pk.writeIdAndData(&buffer)
		if err != nil {
			return err
		}

		// packet length
		_, err = data.VarInt(buffer.Len()).WriteTo(writer)
		if err != nil {
			return err
		}

		_, err = buffer.WriteTo(writer)
		if err != nil {
			return err
		}
	} else {
		zw := zlib.NewWriter(&buffer)

		n, err := pk.writeIdAndData(zw)
		if err != nil {
			return err
		}

		err = zw.Close()
		if err != nil {
			return err
		}

		// data length
		var dataLength bytes.Buffer
		n2, err := data.VarInt(n).WriteTo(&dataLength)
		if err != nil {
			return err
		}

		// packet length
		_, err = data.VarInt(n2 + int64(buffer.Len())).WriteTo(writer)
		if err != nil {
			return err
		}

		_, err = dataLength.WriteTo(writer)
		if err != nil {
			return err
		}

		_, err = buffer.WriteTo(writer)
		if err != nil {
			return err
		}
	}

	return nil
}
