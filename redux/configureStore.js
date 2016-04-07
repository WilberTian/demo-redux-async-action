import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore);

export default function configureStore(initialState) {
    return createStoreWithMiddleware(rootReducer, initialState)
}

/*

const store = createStoreWithMiddleware(rootReducer)

store.dispatch(selectTopic('all'))
store.dispatch(fetchPosts('all')).then(() =>
  console.log(store.getState())
)

store.dispatch(fetchPostsIfNeeded('all')).then(() =>
  console.log(store.getState())
)

*/