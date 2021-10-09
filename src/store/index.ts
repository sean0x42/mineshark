import { configureStore } from "@reduxjs/toolkit";

import playersReducer from "./players";

export const store = configureStore({
  reducer: {
    players: playersReducer,
  },
  devTools: false,
});

export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
