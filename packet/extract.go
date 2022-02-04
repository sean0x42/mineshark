package packet

import (
	"bytes"

	"github.com/sean0x42/mineshark/packet/data"
)

func (packet *Packet) Extract(fields ...data.Field) error {
	reader := bytes.NewReader(packet.Data)

	for _, field := range fields {
		_, err := field.ReadFrom(reader)
		if err != nil {
			return err
		}
	}

	return nil
}
