import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Admin } from '../api/auth';

export type AuthStateType = {
  user: Admin | undefined;
  role: "Client" | "Agent" | "Livreur";
  token: string;
};

// Load initial state from localStorage if available
const loadState = (): AuthStateType => {
  try {
    const serializedState = localStorage.getItem('auth');
    if (serializedState === null) {
      return {
        user: undefined,
        role: "Client",
        token: "",
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      user: undefined,
      role: "Client",
      token: "",
    };
  }
};

// Save auth state to localStorage
export const saveState = (state: AuthStateType) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('auth', serializedState);
  } catch {
    // Ignore write errors
  }
};

const initialState: AuthStateType = loadState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeRole: (state, action: PayloadAction<AuthStateType["role"]>) => {
      state.role = action.payload;
      saveState(state);
    },
    logIn: (state, action: PayloadAction<Omit<AuthStateType, "role">>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      saveState(state);
    },
    logOut: (state) => {
      state.user = undefined;
      state.role = "Client";
      state.token = "";
      localStorage.removeItem('auth');
    },
  },
});

export const { changeRole, logIn, logOut } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthStateType }) => state.auth.user;
export const selectCurrentToken = (state: { auth: AuthStateType }) => state.auth.token;
export const selectCurrentRole = (state: { auth: AuthStateType }) => state.auth.role;
