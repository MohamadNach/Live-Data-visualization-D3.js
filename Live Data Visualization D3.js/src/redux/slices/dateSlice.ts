import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
// import { fetchDataThunks } from '../thunks/dateThunks';
const now = dayjs();
interface dateState {
  from: string | null;
  to: string | null;
}

const initialState: dateState = {
  from: now.toISOString(),
  to: now.toISOString(),
};
export const dateSlice = createSlice({
  name: 'date',
  initialState: initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<dateState>) => {
      state.from = action.payload.from;
      state.to = action.payload.to;
    },
  },
});

export const { setDateRange } = dateSlice.actions;
export default dateSlice.reducer;
