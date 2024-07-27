import React from 'react';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from '~/core';
import RootNavigator from '~/navigation';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
}
