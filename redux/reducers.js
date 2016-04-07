import { combineReducers } from 'redux'
import { SELECT_TOPIC, INVALIDATE_TOPIC, REQUEST_POST, RECEIVE_POST } from './actions'

function selectedTopic(state = 'all', action) {
    switch(action.type) {
        case SELECT_TOPIC:
            return action.topic;
        default:
            return state;
    }
}

function posts(state = { isFetching: false, didInvalidate: false, items: [] }, action) {
    switch(action.type) {
        case INVALIDATE_TOPIC:
            return Object.assign({}, state, {
                didInvalidate: true
            });
            
        case REQUEST_POST:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
            
        case RECEIVE_POST:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items: action.posts,
                lastUpdated: action.receivedAt
            });
            
        default:
            return state;
    }
}

function postsByTopic(state = {}, action) {
    switch(action.type) {
        case INVALIDATE_TOPIC:
        case RECEIVE_POST:
        case REQUEST_POST:
            return Object.assign({}, state, {
                [action.topic]: posts(state[action.topic], action)
            })
        default:
            return state
    } 
}

const rootReducer = combineReducers({
    postsByTopic,
    selectedTopic
});

export default rootReducer;