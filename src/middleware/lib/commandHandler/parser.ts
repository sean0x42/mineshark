enum State {
  SeekingSpace,
  ConsumingExcessSpace,
  SeekingQuote,
}

export default function parseCommand(command: string): string[] {
  const args: string[] = [];
  let buffer = "";
  let state: State = State.ConsumingExcessSpace;

  for (const char of command) {
    switch (state) {
      case State.SeekingSpace:
        if (char === '"') {
          state = State.SeekingQuote;
          continue;
        }

        if (char === " ") {
          args.push(buffer);
          buffer = "";
          state = State.ConsumingExcessSpace;
          continue;
        }

        buffer += char;
        break;

      case State.ConsumingExcessSpace:
        if (char === '"') {
          state = State.SeekingQuote;
          continue;
        }

        if (char !== " ") {
          state = State.SeekingSpace;
        }

        buffer += char;
        break;

      case State.SeekingQuote:
        if (char === '"') {
          args.push(buffer);
          buffer = "";
          state = State.SeekingSpace;
          continue;
        }

        buffer += char;
        break;
    }
  }

  if (buffer.length > 0) {
    args.push(buffer);
  }

  return args;
}
