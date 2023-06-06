import { createSlice } from '@reduxjs/toolkit';

export const alertSlice = createSlice({
  name: 'alert',
  initialState: {
    show: false,
    message: '',
    type: ''
  },
  reducers: {
    showAlert: (state, action) => {
      state.show = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    hideAlert: (state) => {
      state.show = false;
      state.message = '';
      state.type = '';
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;
