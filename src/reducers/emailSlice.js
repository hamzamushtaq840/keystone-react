// emailSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setEmail: (state, action) => {
        return action.payload;
        },
    setForgotEmail: (state, action) => {
        return action.payload;
    
    },
  },
});

export const { setEmail, setForgotEmail } = emailSlice.actions;

export default emailSlice.reducer;
