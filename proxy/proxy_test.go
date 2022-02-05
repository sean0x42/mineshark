package proxy

import (
	"bytes"
	"net"
	"testing"

	log "github.com/sirupsen/logrus"
)

func TestProxyPipeDoesNotMutate(t *testing.T) {
	// Given
	source := bytes.NewBuffer([]byte{0x3, 0x0, 0x1, 0x2})
	var destination bytes.Buffer

	proxy := Proxy{
		controller: &Controller{},
		threshold:  -1,
		clientAddr: &net.TCPAddr{
			IP:   net.IPv4(0x7f, 0x0, 0x0, 0x1),
			Port: 25566,
		},
		serverAddr: &net.TCPAddr{
			IP:   net.IPv4(0x7f, 0x0, 0x0, 0x1),
			Port: 25565,
		},
		log: log.WithFields(log.Fields{}),
	}

	// When
	proxy.pipe(source, &destination)
}
