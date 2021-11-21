import { createSlice } from '@reduxjs/toolkit';

import { routes } from 'routes';

import * as api from './task.api';

const initialState = [];

const userSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    list: (state, action) => action.payload.tasks,
    shuffle: (state, action) => action.payload.tasks,
    create: (state, action) => [action.payload.task, ...state],
    close: (state, action) => {
      const { task } = action.payload;

      return state.map((t) => (t._id === task._id ? task : t));
    },
  },
});

const {
  list, create, close, shuffle,
} = userSlice.actions;

const listTasks = () => async (dispatch) => {
  const tasks = await api.list();
  dispatch(list({ tasks }));
};

const shuffleTasks = () => async (dispatch) => {
  const tasks = await api.shuffle();
  dispatch(shuffle({ tasks }));
};

const createTask = () => async (dispatch) => {
  const task = await api.create();
  dispatch(create({ task }));
};

const closeTask = (id) => async (dispatch) => {
  const task = await api.close(id);
  dispatch(close({ task }));
};

export const taskActions = {
  listTasks,
  createTask,
  closeTask,
  shuffleTasks,
};

export default userSlice.reducer;
