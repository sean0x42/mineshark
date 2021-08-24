export enum State {
  Handshaking = "handshaking",
  Status = "status",
  Login = "login",
  Play = "play",
}

export const numericToState: Partial<Record<number, State>> = {
  0: State.Handshaking,
  1: State.Status,
  2: State.Login,
  3: State.Play,
};
