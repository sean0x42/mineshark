package packet

// See https://wiki.vg/Protocol#Handshaking
const Handshake = 0x0

// See https://wiki.vg/Protocol#Status
const (
	StatusResponse     = 0x0
	StatusPongResponse = 0x1
)

// See https://wiki.vg/Protocol#Status
const (
	StatusRequest     = 0x0
	StatusPingRequest = 0x1
)

// See https://wiki.vg/Protocol#Login
const (
	LoginDisconnect        = 0x0
	LoginEncryptionRequest = 0x1
	LoginSuccess           = 0x2
	SetCompression         = 0x3
	LoginPluginRequest     = 0x4
)

// See https://wiki.vg/Protocol#Login
const (
	LoginStart              = 0x0
	LoginEncryptionResponse = 0x1
	LoginPluginResponse     = 0x2
)
