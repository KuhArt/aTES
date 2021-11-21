import { createSlice } from '@reduxjs/toolkit';

import * as api from './myAccount.api';

const initialState = {
  balance: 0,
  transactions: [],
  totals: {
    amount: 0,
    usersWithNegativeBalance: [],
   },
};

const userSlice = createSlice({
  name: 'myAccount',
  initialState,
  reducers: {
    getCurrentStats: (state, action) => ({ ...state, ...action.payload.myAccount }),
    getTotals: (state, action) => ({ ...state, totals: action.payload.totals }),
  },
});

const {
  getCurrentStats, getTotals,
} = userSlice.actions;

const getMyAccountStats = () => async (dispatch) => {
  const myAccount = await api.getCurrentStats();
  dispatch(getCurrentStats({ myAccount }));
};
const getMyAccountTotals = () => async (dispatch) => {
  const totals = await api.getTotals();
  dispatch(getTotals({ totals }));
};

export const myAccountActions = {
  getMyAccountStats,
  getMyAccountTotals,
};

export default userSlice.reducer;
