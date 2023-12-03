import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import {rootWatcher} from './rootWatcher';
import {UserReducerName, userReducer} from './user';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    [UserReducerName]: userReducer,
  },
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootWatcher);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
