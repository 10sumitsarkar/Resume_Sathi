'use client';

import { Provider } from 'react-redux';

import {
  PersistGate
} from 'redux-persist/integration/react';

import {
  store,
  persistor
} from './store';

// gate = true  (default): children wait until persisted state is loaded (old behaviour).
// gate = false: children render immediately; persisted state still loads in the
// background and components read it through useSelector when it arrives.
export default function ReduxProvider({ children, loading = null, gate = true }) {
  return (
    <Provider store={store}>
      {gate ? (
        <PersistGate
          loading={loading}
          persistor={persistor}
        >
          {children}
        </PersistGate>
      ) : (
        children
      )}
    </Provider>
  );
}
