import {all} from 'redux-saga/effects';
import {userWatcher} from './user/sagas';

export function* rootWatcher() {
  yield all([userWatcher()]);
}
