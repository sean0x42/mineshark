import { configureStore } from "@reduxjs/toolkit";

import playersReducer from "./players";
import permissionsReducer from "./permissions";

export const store = configureStore({
  reducer: {
    players: playersReducer,
    permissions: permissionsReducer,
  },
  devTools: false,
});

export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppSelector<T> = (state: RootState) => T;
