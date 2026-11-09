'use client';

import { Provider } from 'react-redux';

import {
  PersistGate
} from 'redux-persist/integration/react';

import {
  store,
  persistor
} from './store';

export default function ReduxProvider({ children, loading = null }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={loading}
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}