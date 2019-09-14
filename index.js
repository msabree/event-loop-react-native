/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import { Root } from "native-base";
import App from './App';
import {name as appName} from './app.json';

// state management using redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thinkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from './src/reducers';

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });

function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      thinkMiddleware,
      loggerMiddleware,
    ),
  );
  return createStore(reducer, initialState, enhancer);
}

const store = configureStore({});

const AppWithReduxStore = () => (
    <Provider store={store}>
        <Root>
            <App />
        </Root>
    </Provider>
)

AppRegistry.registerComponent(appName, () => AppWithReduxStore);