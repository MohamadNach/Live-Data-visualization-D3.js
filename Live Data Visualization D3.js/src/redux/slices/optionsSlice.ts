import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OptionsState {
  chartId: string;
  chartTitle: string;
}

const initialState: OptionsState = {
  chartId: '',
  chartTitle: '',
};
export const optionsSlice = createSlice({
  name: 'options',
  initialState,
  reducers: {
    setOption: (state, action: PayloadAction<OptionsState>) => {
      state.chartId = action.payload.chartId;
      state.chartTitle = action.payload.chartTitle;
    },
  },
});

export const { setOption } = optionsSlice.actions;
export default optionsSlice.reducer;
