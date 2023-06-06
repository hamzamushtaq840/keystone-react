import { createSlice } from '@reduxjs/toolkit';

export const driverSlice = createSlice({
  name: 'driver',
  initialState: {
    driverData: {},
    driverId: null,
  },
  reducers: {
    setDriverData: (state, action) => {
      state.driverData = action.payload;
    },
    setDriverId: (state, action) => {
      state.driverId = action.payload;
    },
    clearDriverData: (state) => {
      state.driverData = {};
      state.driverId = null;
    },
  },
});

export const { setDriverData, clearDriverData, setDriverId } = driverSlice.actions;

export const selectDriverData = state => state.driver.driverData;
export const selectDriverId = state => state.driver.driverId;

export default driverSlice.reducer;
