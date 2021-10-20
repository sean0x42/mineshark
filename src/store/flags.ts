import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FlagsState {
  flagsByName: Record<string, string[]>;
}

const initialState: FlagsState = {
  flagsByName: {},
};

export const flagsSlice = createSlice({
  name: "flags",
  initialState,
  reducers: {
    setFlag: (state, action: PayloadAction<{ name: string; flag: string }>) => {
      const { name, flag } = action.payload;

      if (state.flagsByName[name] === undefined) {
        state.flagsByName[name] = [];
      }

      if (!state.flagsByName[name].includes(flag)) {
        state.flagsByName[name].push(flag);
      }
    },

    unsetFlag: (
      state,
      action: PayloadAction<{ name: string; flag: string }>
    ) => {
      const { name, flag } = action.payload;

      if (state.flagsByName[name] === undefined) {
        return;
      }

      state.flagsByName[name] = state.flagsByName[name].filter(
        (f) => f !== flag
      );
    },
  },
});

export const { setFlag, unsetFlag } = flagsSlice.actions;
export default flagsSlice.reducer;
