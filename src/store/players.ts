import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PlayersState {
  nameByAddr: Record<string, string>;
  addrByName: Record<string, string>;
}

const initialState: PlayersState = {
  nameByAddr: {},
  addrByName: {},
};

export const playersSlice = createSlice({
  name: "players",
  initialState,
  reducers: {
    registerPlayer: (
      state,
      action: PayloadAction<{ addr: string; name: string }>
    ) => {
      const { name, addr } = action.payload;
      state.addrByName[name] = addr;
      state.nameByAddr[addr] = name;
    },
  },
});

export const { registerPlayer } = playersSlice.actions;
export default playersSlice.reducer;
