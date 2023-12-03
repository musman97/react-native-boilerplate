import React from 'react';
import {Provider} from 'react-redux';
import RootNavigator from '~/navigation';
import {store} from '~/state';

function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}

export default App;
