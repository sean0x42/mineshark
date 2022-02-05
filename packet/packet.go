package packet

import "github.com/sean0x42/mineshark/packet/data"

type Packet struct {
	Id        data.VarInt
	Data      []byte
	Recipient string
	Sender    string
}

func New(sender string, recipient string) Packet {
	return Packet{
		Sender:    sender,
		Recipient: recipient,
	}
}
