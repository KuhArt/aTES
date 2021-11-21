import { createSlice } from '@reduxjs/toolkit';

import * as api from './myAccount.api';

const initialState = {
  balance: 0,
  transactions: [],
  totals: {
    amount: 0,
    usersWithNegativeBalance: 0,
    transactions: [],
  },
  taskStats: {},
};

const userSlice = createSlice({
  name: 'myAccount',
  initialState,
  reducers: {
    getCurrentStats: (state, action) => ({ ...state, ...action.payload.myAccount }),
    getTotals: (state, action) => ({ ...state, totals: action.payload.totals }),
    getTasksStats: (state, action) => ({ ...state, taskStats: action.payload.taskStats }),
  },
});

const {
  getCurrentStats, getTotals, getTasksStats,
} = userSlice.actions;

const getMyAccountStats = () => async (dispatch) => {
  const myAccount = await api.getCurrentStats();
  dispatch(getCurrentStats({ myAccount }));
};
const getMyAccountTotals = () => async (dispatch) => {
  const totals = await api.getTotals();
  dispatch(getTotals({ totals }));
};
const getMyAccountTasksStats = () => async (dispatch) => {
  const taskStats = await api.getTasksStats();
  dispatch(getTasksStats({ taskStats }));
};

export const myAccountActions = {
  getMyAccountStats,
  getMyAccountTotals,
  getMyAccountTasksStats,
};

export default userSlice.reducer;
