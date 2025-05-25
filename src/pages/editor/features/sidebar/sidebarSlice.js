import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currTab: "explore",
  currTabTitle: "Explore",
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: initialState,
  reducers: {
    selectMenu: (state, action) => {
      state.currTab = action.payload.name;
      state.currTabTitle = action.payload.title;
    },
    setActiveTab: (state, action) => {
      state.currTab = action.payload.tab;
      state.currTabTitle = action.payload.title;
    },
  },
});

export const { selectMenu, setActiveTab } = sidebarSlice.actions;
export default sidebarSlice.reducer;
