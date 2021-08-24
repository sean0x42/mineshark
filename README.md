# Minecraft-in-the-Middle

> **Note:**This project is for educational purposes only. Please only ever use
> this tool against your own client, or clients that have explicitly consented.

A packet sniffing proxy that sits between a Minecraft client and server.
Supports the creation of custom middleware that can:

1. Kill packets in transit
2. Construct new packets
3. Modify packets

## Project layout

| Directory     | Purpose                                                                    |
| :------------ | :------------------------------------------------------------------------- |
| `middleware/` | Contains middleware that should be run over each packet.                   |
| `reader/`     | Logic for reading packets as a byte array into more useful packet objects. |
| `writer/`     | Logic for converting packet objects back into byte arrays.                 |
