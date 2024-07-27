/**
 * Inspiration from: https://stackoverflow.com/a/58299291
 */

import {LogBox} from 'react-native';

const ignoreWarns: string[] = [];

const warn = console.warn;
console.warn = (...args) => {
  console.log('args', args);

  for (const warning of ignoreWarns) {
    if (args?.[0]?.startsWith(warning)) {
      return;
    }
  }
  warn(...args);
};

LogBox.ignoreLogs(ignoreWarns);
