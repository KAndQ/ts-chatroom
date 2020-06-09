import React, { Component } from "react";
import "../App.css";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { connect, Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

// actions
const SELECT_SUBREDDIT = "SELECT_SUBREDDIT";

function selectSubreddit(subreddit: any) {
    return {
        type: SELECT_SUBREDDIT,
        subreddit,
    };
}

const INVALIDATE_SUBREDDIT = "INVALIDATE_SUBREDDIT";
export function invalidateSubreddit(subreddit: any) {
    return {
        type: INVALIDATE_SUBREDDIT,
        subreddit,
    };
}

const REQUEST_POSTS = "REQUEST_POSTS";
function requestPosts(subreddit: any) {
    return {
        type: REQUEST_POSTS,
        subreddit,
    };
}

const RECEIVE_POSTS = "RECEIVE_POSTS";
function receivePosts(subreddit: any, json: any) {
    return {
        type: RECEIVE_POSTS,
        subreddit,
        posts: json.data.children.map((child: any) => child.data),
        receivedAt: Date.now(),
    };
}

function fetchPosts(subreddit: any) {
    return async (dispatch: any) => {
        dispatch(requestPosts(subreddit));
        return fetch(`http://www.reddit.com/r/${subreddit}.json`)
            .then((response) => response.json())
            .then((json) => dispatch(receivePosts(subreddit, json)));
    };
}

function shouldFetchPosts(state: any, subreddit: any) {
    const posts = state.postsBySubreddit[subreddit];
    if (!posts) {
        return true;
    } else if (posts.isFetching) {
        return false;
    } else {
        return posts.didInvalidate;
    }
}

function fetchPostsIfNeeded(subreddit: any) {
    // 注意这个函数也接收了 getState() 方法
    // 它让你选择接下来 dispatch 什么。

    // 当缓存的值是可用时，
    // 减少网络请求很有用。

    return (dispatch: any, getState: any) => {
        if (shouldFetchPosts(getState(), subreddit)) {
            // 在 thunk 里 dispatch 另一个 thunk！
            return dispatch(fetchPosts(subreddit));
        } else {
            // 告诉调用代码不需要再等待。
            return Promise.resolve();
        }
    };
}

// reduces

function selectedsubreddit(state = "reactjs", action: any) {
    console.log("==>> selectedsubreddit");
    switch (action.type) {
        case SELECT_SUBREDDIT:
            return action.subreddit;
        default:
            return state;
    }
}

function posts(
    state = {
        isFetching: false,
        didInvalidate: false,
        items: [],
    },
    action: any
) {
    switch (action.type) {
        case INVALIDATE_SUBREDDIT:
            return Object.assign({}, state, {
                didInvalidate: true,
            });
        case REQUEST_POSTS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false,
            });
        case RECEIVE_POSTS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items: action.posts,
                lastUpdated: action.receivedAt,
            });
        default:
            return state;
    }
}

function postsBySubreddit(state: any = {}, action: any) {
    switch (action.type) {
        case INVALIDATE_SUBREDDIT:
        case RECEIVE_POSTS:
        case REQUEST_POSTS:
            return Object.assign({}, state, {
                [action.subreddit]: posts(state[action.subreddit], action),
            });
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    postsBySubreddit,
    selectedsubreddit,
});

const simpleMiddleware = (store: any) => (next: any) => (action: any) => {
    console.log("==>> run simpleMiddleware before next");
    const result = next(action);
    console.log("==>> run simpleMiddleware after next");
    return result;
};

const store = createStore(rootReducer, applyMiddleware(simpleMiddleware));

console.log(store.getState());
store.dispatch(selectSubreddit("reactjs"));
console.log(store.getState());

export default class ReduxAsyncApp extends Component {
    render() {
        return <div></div>;
    }
}
