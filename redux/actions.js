import fetch from 'isomorphic-fetch';

export const SELECT_TOPIC  = 'SELECT_TOPIC';

export function selectTopic(topic) {
    return {
        type: SELECT_TOPIC,
        topic
    }
}


export const INVALIDATE_TOPIC = 'INVALIDATE_TOPIC';

export function invalidateTopic(topic) {
    return {
        type: INVALIDATE_TOPIC,
        topic
    }
}


export const REQUEST_POST = 'REQUEST_POST';

export function requestPost(topic) {
    return {
        type: REQUEST_POST,
        topic
    }
}


export const RECEIVE_POST = 'RECEIVE_POST';

export function receivePost(topic, json) {
    return {
        type: RECEIVE_POST,
        topic,
        posts: json.data,
        receivedAt: Date.now()
    }
}


function fetchPosts(topic) {
    return function(dispatch) {
        dispatch(requestPost(topic));
        
        return fetch('https://cnodejs.org/api/v1/topics?tab=' + topic)
            .then(response => response.json())
            .then(json => 
                dispatch(receivePost(topic, json))
            );
    }
}

function shouldFetchPosts(state, topic) {
    const posts = state.postsByTopic[topic];
    
    if(!posts) {
        return true;
    } else if (posts.isFecthing) {
        return false;
    } else {
        return posts.didInvalidate;
    }
}

export function fetchPostsIfNeeded(topic) {
    return (dispatch, getState) => {
        if (shouldFetchPosts(getState(), topic)) {
            return dispatch(fetchPosts(topic));
        } else {
            return Promise.resolve();
        }
    }
}

