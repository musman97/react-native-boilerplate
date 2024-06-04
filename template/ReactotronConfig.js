import Reactotron, {networking} from 'reactotron-react-native';
import mmkvPlugin from 'reactotron-react-native-mmkv';
import {storage} from '~/core';

Reactotron.configure()
  .useReactNative(networking())
  .useReactNative(mmkvPlugin({storage}))
  .connect();
