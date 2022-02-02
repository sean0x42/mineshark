package packet

// See https://github.com/Tnze/go-mc
// See https://wiki.vg/Protocol

import (
	"bytes"
	"compress/zlib"
	"io"
)

func (pk *Packet) writeIdAndData(writer io.Writer) (int, error) {
	n1, err := writeVarInt(writer, pk.Id)
	if err != nil {
		return n1, err
	}

	n2, err := writer.Write(pk.Data)
	if err != nil {
		return n1 + n2, err
	}

	return n1 + n2, nil
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

	_, err = writeVarInt(writer, VarInt(buffer.Len()))
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
		_, err = writeVarInt(&buffer, 0)
		if err != nil {
			return err
		}

		_, err = pk.writeIdAndData(&buffer)
		if err != nil {
			return err
		}

		// packet length
		_, err = writeVarInt(writer, VarInt(buffer.Len()))
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
		n2, err := writeVarInt(&dataLength, VarInt(n))
		if err != nil {
			return err
		}

		// packet length
		_, err = writeVarInt(writer, VarInt(n2+buffer.Len()))
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
