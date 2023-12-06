import React from 'react';
import {QueryClientProvider} from 'react-query';
import {queryClient} from '~/core';
import RootNavigator from '~/navigation';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
}
