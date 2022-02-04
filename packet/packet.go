package packet

import "github.com/sean0x42/mineshark/packet/data"

type Packet struct {
	Id        data.VarInt
	Data      []byte
	recipient string
	sender    string
}

func New(recipient string, sender string) Packet {
	return Packet{recipient: recipient, sender: sender}
}
