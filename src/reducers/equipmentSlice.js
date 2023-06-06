import { createSlice } from '@reduxjs/toolkit';

export const equipmentSlice = createSlice({
  name: 'equipment',
  initialState: {
    equipmentData: {},
    equipmentId: null,
  },
  reducers: {
    setEquipmentData: (state, action) => {
      state.equipmentData = action.payload;
    },
    setEquipmentId: (state, action) => {
      state.equipmentId = action.payload;
    },
    clearEquipmentData: (state) => {
      state.equipmentData = {};
      state.equipmentId = null
    },
  },
});

export const { setEquipmentData, clearEquipmentData, setEquipmentId } = equipmentSlice.actions;

export const selectEquipmentData = state => state.equipment.equipmentData;
export const selectEquipmentId = state => state.equipment.equipmentId;

export default equipmentSlice.reducer;
