package data

import (
	"bytes"
	"testing"
)

func TestStringReadFrom(t *testing.T) {
	// Given
	var actual String

	expected := "Hello world!"
	asBytes := []byte(expected)
	length := len(asBytes)

	// Strings are comprised of length + bytes
	var buffer bytes.Buffer
	nl, err := VarInt(length).WriteTo(&buffer)
	if err != nil {
		t.Logf("Failed to write VarInt: %s.", err)
	}

	buffer.Write(asBytes)

	// When
	ns, err := actual.ReadFrom(&buffer)

	// Then
	if err != nil {
		t.Logf("Failed to read String: %s.", err)
		t.FailNow()
	}

	if ns != nl+int64(length) {
		t.Errorf("Read length %d, but should be %d.", ns, nl+int64(length))
	}

	if string(actual) != expected {
		t.Errorf("Expected string: '%s'. Found '%s' instead.", expected, actual)
	}
}

func TestStringWriteTo(t *testing.T) {
	// Given
	string := String("Milkshakes")
	asBytes := []byte(string)
	length := len(asBytes)
	var buffer bytes.Buffer

	// When
	n, err := string.WriteTo(&buffer)
	bufferLength := buffer.Len()

	// Then
	if err != nil {
		t.Logf("Failed to write String: %s", err)
		t.FailNow()
	}

	if int(n) != bufferLength {
		t.Errorf("Incorrect byte length. Expected %d. Found %d", bufferLength, n)
	}

	// Compute varint length
	var lengthBuffer bytes.Buffer
	VarInt(length).WriteTo(&lengthBuffer)
	lengthPortion := buffer.Next(lengthBuffer.Len())

	if !bytes.Equal(lengthPortion, lengthBuffer.Bytes()) {
		t.Errorf("String does not start with valid VarInt length.\nExpected %v.\nFound%v", lengthBuffer, lengthPortion)
	}

	remaining := buffer.Bytes()
	if !bytes.Equal(remaining, asBytes) {
		t.Logf("Remaining bytes not equal.\nExpected %v\nFound %v", asBytes, remaining)
		t.FailNow()
	}
}
