import { configureStore } from "@reduxjs/toolkit";

import playersReducer from "./players";
import permissionsReducer from "./permissions";
import flagsReducer from "./flags";

export const store = configureStore({
  reducer: {
    players: playersReducer,
    permissions: permissionsReducer,
    flags: flagsReducer,
  },
  devTools: false,
});

export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppSelector<T> = (state: RootState) => T;
