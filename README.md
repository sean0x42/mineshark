# Mineshark 🦈 (WIP)

> **Note:** This project is for educational purposes only. Please only ever use
> this tool against your own client, or clients that have explicitly consented.

A (work in progress) packet sniffing proxy that sits between a Minecraft client
and server. Mineshark is not really ready for use yet, but you can mess around
if you like.

## Features

1. Spy on all packets sent between client and server.
2. Kill packets in transit
3. Construct and send new packets. You can copy existing packets to essentially
   mutate them in transit.

## Project layout

| Directory     | Purpose                                                                    |
| :------------ | :------------------------------------------------------------------------- |
| `middleware/` | Contains middleware that should be run over each packet.                   |
| `reader/`     | Logic for reading packets as a byte array into more useful packet objects. |
| `writer/`     | Logic for converting packet objects back into byte arrays.                 |
