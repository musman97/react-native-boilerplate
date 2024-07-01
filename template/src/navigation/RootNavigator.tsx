import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {defaultScreenOptions} from './config';
import {RouteName} from './routes';
import {Login, Splash} from '~/screens';
import {RootStackParamList} from './types';
import {GlobalSelectors, useGlobalStore} from '~/state';

const RootStack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const splashLoading = useGlobalStore(GlobalSelectors.selectSplashLodaing);
  const loggedIn = useGlobalStore(GlobalSelectors.selectLoggedIn);

  const renderScreens = React.useCallback(() => {
    if (splashLoading) {
      return (
        <>
          <RootStack.Screen name={RouteName.Splash} component={Splash} />
        </>
      );
    } else if (!loggedIn) {
      return (
        <>
          <RootStack.Screen name={RouteName.Login} component={Login} />
        </>
      );
    }
  }, [splashLoading, loggedIn]);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={defaultScreenOptions}>
        {renderScreens()}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
