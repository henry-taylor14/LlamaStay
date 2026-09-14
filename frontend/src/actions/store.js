import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import { llamaReducer } from '../reducers/llamaReducers';

const reducer = combineReducers({
  llamaList: llamaReducer,
});

// Picks up the Redux DevTools browser extension when it's installed, without
// depending on the deprecated redux-devtools-extension package.
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunk))
);
