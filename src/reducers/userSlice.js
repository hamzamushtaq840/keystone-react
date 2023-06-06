// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  authToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, authToken } = action.payload;
      state.user = user;
      state.authToken = authToken;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userId', user.id);

    },
    logout: (state) => {
      state.user = null;
      state.authToken = null;
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
