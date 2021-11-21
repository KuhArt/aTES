import { configureStore } from '@reduxjs/toolkit';

import history from 'services/history.service';

import user from './user/user.slice';
import toast from './toast/toast.slice';
import tasks from './task/task.slice';
import myAccount from './myAccount/myAccount.slice';

export default configureStore({
  reducer: {
    user,
    toast,
    tasks,
    myAccount,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: { extraArgument: { history } },
  }),
});
