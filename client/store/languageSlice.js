
import { createSlice } from '@reduxjs/toolkit';

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    currentLanguage: 'ko'
  },
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
    }
  }
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
