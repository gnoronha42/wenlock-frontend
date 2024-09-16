import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../../types/IAuth';



const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('token'), 
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null, 
  accessToken: localStorage.getItem('token'),
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ accessToken: string; fullName: string; email: string }>) {
    state.isAuthenticated = true;
    state.user = {
        fullName: action.payload.fullName,
        email: action.payload.email,
    };
    state.accessToken = action.payload.accessToken;
    state.error = null;

    
    localStorage.setItem('user', JSON.stringify(state.user));
},
    loginFailure(state, action: PayloadAction<string>) {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
