import React from 'react';
import {View, StyleSheet, Modal, ActivityIndicator} from 'react-native';
import {Colors, GlobalStyles} from '~/theme';

export interface SpinnerProps {
  visible: boolean;
}

export function Spinner(props: SpinnerProps) {
  return (
    <Modal style={GlobalStyles.f1} transparent visible={props.visible}>
      <View style={styles.container}>
        <ActivityIndicator color={Colors.white} size="large" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.overlay,
  },
});
