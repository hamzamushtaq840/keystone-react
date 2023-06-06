import { createSlice } from '@reduxjs/toolkit'

// Define the initial state for the equipmentDashboard
const initialState = {
    id: null,
    selectedEquipment: null,
};

export const equipmentDashboardSlice = createSlice({
    name: 'equipmentDashboard',
    initialState,
    reducers: {
        setId: (state, action) => {
            state.id = action.payload;
        },
        selectedEquipment: (state, action) => {
            state.selectedEquipment = action.payload;
        }
    },
});

// Export the reducer and actions
export const { setId , selectedEquipment } = equipmentDashboardSlice.actions;
export default equipmentDashboardSlice.reducer;
