package packet

type Packet struct {
	Id        VarInt
	Data      []byte
	recipient string
	sender    string
}

func New(recipient string, sender string) Packet {
	return Packet{recipient: recipient, sender: sender}
}
