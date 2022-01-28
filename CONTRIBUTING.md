# Contributing

To be filled in.

## Mineshark architecture

Mineshark contains two core components:

1. A TCP proxy written in [Go][go.dev], which inspects and proxies packets as they pass between the Minecraft client(s) and server. We call this component the **proxy**.
2. A [React][react] application, that enables users to interact with the proxy through a convenient interface. We call this component the **frontend**.

### How does the proxy work?

The proxy is also comprised of a number of sub-components:

1. A simple TCP packet proxy.
2. A packet serializer (struct to bytes) and deserializer (bytes to struct).
3. An NBT reader/writer. Converts NBT data to high level data structures.
4. A rule engine, which interprets custom rules to modify packets as they pass through the proxy.
5. A HTTP API, which enables the official React frontend (and potentially a custom one) to communicate with and configure the proxy.
6. A websocket protocol, to allow a frontend to subscribe to packet activity.

### How does the frontend work?

The frontend is a React SPA powered by [Next.js][nextjs]. It contains a custom UI for recording packet traffic, and offers a rule configuration tool.

[go.dev]: https://go.dev/
[react]: https://reactjs.org/
[nextjs]: https://nextjs.org/
