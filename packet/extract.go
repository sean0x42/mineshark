package packet

import (
	"bytes"

	"github.com/sean0x42/mineshark/packet/data"
	log "github.com/sirupsen/logrus"
)

func (packet *Packet) Extract(fields ...data.Field) error {
	reader := bytes.NewReader(packet.Data)
	log.Debugf("Reader size: %d", reader.Size())

	for _, field := range fields {
		_, err := field.ReadFrom(reader)
		if err != nil {
			return err
		}
	}

	return nil
}
