import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppSelector } from ".";

export type PermissionScope = "session" | "global";

export interface Permissions {
  canExecuteCommands: boolean;
  scope: PermissionScope;
}

export interface PermissionsState {
  permsById: Record<string, Permissions>;
}

export function canExecuteCommands(clientId: string): AppSelector<boolean> {
  return (state) => {
    const perms = state.permissions.permsById[clientId];

    if (perms === undefined || !perms.canExecuteCommands) {
      return false;
    }

    return true;
  };
}

const initialState: PermissionsState = {
  permsById: {},
};

export const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    permitCanExecuteCommands: (
      state,
      action: PayloadAction<{ clientId: string; scope: PermissionScope }>
    ) => {
      const { clientId, scope } = action.payload;

      if (state.permsById[clientId] === undefined) {
        state.permsById[clientId] = {
          scope: "session",
          canExecuteCommands: false,
        };
      }

      state.permsById[clientId].canExecuteCommands = true;
      state.permsById[clientId].scope = scope;
    },
  },
});

export const { permitCanExecuteCommands } = permissionsSlice.actions;
export default permissionsSlice.reducer;
