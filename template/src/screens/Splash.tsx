import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {useDispatch} from 'react-redux';
import {UserActions} from '~/state';
import {Colors, FontSize} from '~/theme';

export interface SplashProps {}

export function Splash(props: SplashProps) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    setTimeout(() => {
      dispatch(UserActions.setSplashLoading(false));
    }, 3 * 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Red Buffer React Native Boilerplate</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
  },
  mainText: {
    fontSize: FontSize.lg,
    marginHorizontal: responsiveWidth(5),
    color: Colors.primary,
    textAlign: 'center',
  },
});
