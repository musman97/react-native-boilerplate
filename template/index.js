import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';
import App from './App';
import {name as appName} from './app.json';

if (__DEV__) {
  require('./reacatoron.config');
  require('./ignoreWarns');
}

AppRegistry.registerComponent(appName, () => App);
