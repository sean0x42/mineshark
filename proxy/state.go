package proxy

type State int

const (
	Handshaking State = iota
	Status
	Login
	Play
)
