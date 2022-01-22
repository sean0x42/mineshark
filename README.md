# Mineshark 🦈 (WIP)

> **Note:** This project is for educational purposes only. Please only ever use
> this tool against your own client, or clients that have explicitly consented.

A (work in progress) packet sniffing proxy that sits between a Minecraft client
and server. Mineshark is not really ready for use yet, but you can mess around
if you like.

## Features

1. Spy on all packets sent between client and server.
2. Write custom rules to modify packets in transit.

## Offline Mode

Note that the target Minecraft server MUST be set to offline mode for this to
work. Online servers have an extra protection against [man-in-the-middle
attacks][mitm], which prevents Mineshark from working on any packets after a
successful login.

As a quick summary, both the Minecraft client and server will contact Mojang's
authentication services during login. They will both generate a hash, including
the server's public key that is used for encryption. The basis of a MITM attack
involves changing this public key in transit, and so when the client and server
generate this hash, they produce different values.

[mitm]: https://en.wikipedia.org/wiki/Man-in-the-middle_attack

> todo create a diagram for this
