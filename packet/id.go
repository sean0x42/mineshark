package packet

// See https://wiki.vg/Protocol#Handshaking
const Handshake = iota

// See https://wiki.vg/Protocol#Clientbound_2
const (
	StatusResponse = iota
	StatusPongResponse
)

// See https://wiki.vg/Protocol#Serverbound_2
const (
	StatusRequest = iota
	StatusPingRequest
)

const (
	LoginDisconnect = iota
	LoginEncryptionRequest
	LoginSuccess
	SetCompression
	LoginPluginRequest
)

const (
	LoginStart = iota
	LoginEncryptionResponse
	LoginPluginResponse
)
