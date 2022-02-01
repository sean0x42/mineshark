package packet

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

const (
	StatusResponse = iota
	StatusPongResponse
)

const (
	StatusRequest = iota
	StatusPingRequest
)
