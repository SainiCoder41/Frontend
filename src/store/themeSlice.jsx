// features/theme/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage if available
const initialState = {
  darkMode: localStorage.getItem('darkMode') === 'true' || false
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      // Save to localStorage whenever it changes
      localStorage.setItem('darkMode', state.darkMode);
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', state.darkMode);
    }
  }
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;