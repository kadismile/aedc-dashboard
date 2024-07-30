import { createSlice } from "@reduxjs/toolkit";


export const staffSlice = createSlice({
  name: "staff",
  initialState: {
    staff: undefined,
  },
  reducers: {
    setStaff(state, action) {
      console.log('action', action.payload)
      state.staff = action.payload
    },
    setToken(state, action) {
      state.staff.token = action.payload
    }, 
    setSearchParams(state, action) {
      state.staff.searchParams = {
        ...state?.staff.searchParams,
        ...action.payload
      };
    },
    setAddress(state, action) {
      state.staff.mapAddress = {
        ...state?.staff.mapAddress,
        ...action.payload
      };
    }, 
    clearToken: (state) => {
      state = null;
      return state;
    },
    resetStaff(state) {
      state.staff = undefined;
      localStorage.setItem('persist:root', '')
    },
  },
});


export const { 
  resetStaff, 
  clearToken, 
  setStaff, 
  setToken,
  setSearchParams,
  setAddress
} = staffSlice.actions;
export const selectStaff = (state) => state.staff;



export default staffSlice.reducer;