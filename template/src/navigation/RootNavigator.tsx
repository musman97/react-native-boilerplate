import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {defaultScreenOptions, RouteName} from './config';
import {Login, Splash} from '~/screens';
import {useSelector} from 'react-redux';
import {UserSelectors} from '~/state';
import {RootStackParamList} from './types';

const RootStack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const userState = useSelector(UserSelectors.selectState);

  const renderScreens = React.useCallback(() => {
    if (userState.splashLoading) {
      return (
        <>
          <RootStack.Screen name={RouteName.Splash} component={Splash} />
        </>
      );
    } else if (!userState.loggedIn) {
      return (
        <>
          <RootStack.Screen name={RouteName.Login} component={Login} />
        </>
      );
    }
  }, [userState.splashLoading, userState.loggedIn]);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={defaultScreenOptions}>
        {renderScreens()}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
