import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Colors, FontSize, hSpacing} from '~/theme';

export interface LoginProps {}

export function Login(props: LoginProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: FontSize.lg,
    color: Colors.primary,
    marginHorizontal: hSpacing(5),
    textAlign: 'center',
  },
});
