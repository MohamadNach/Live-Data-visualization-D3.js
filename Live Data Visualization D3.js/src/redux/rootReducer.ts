import { combineReducers } from '@reduxjs/toolkit';

import dateReducer from '../redux/slices/dateSlice';
import optionsReducer from '../redux/slices/optionsSlice';

const rootReducer = combineReducers({
  dateR: dateReducer,
  optionsR: optionsReducer,
});

export default rootReducer;
