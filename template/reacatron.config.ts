import Reactotron, {ReactotronReactNative} from 'reactotron-react-native';
import mmkvPlugin from 'reactotron-react-native-mmkv';
import {StorageService} from '~/core';
import AppJson from './app.json';

console.tron = Reactotron.configure({name: AppJson.displayName})
  .useReactNative()
  .use(
    mmkvPlugin<ReactotronReactNative>({
      storage: StorageService.storageInstance,
    }),
  )
  .connect();
