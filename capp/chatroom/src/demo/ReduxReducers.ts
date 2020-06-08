import { combineReducers } from "redux";
import { ADD_TODO, TOGGLE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters } from "./ReduxActions";
const { SHOW_ALL } = VisibilityFilters;

function visibilityFilter(state = SHOW_ALL, action: any) {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return action.filter;
        default:
            return state;
    }
}

function todos(state = [], action: any) {
    switch (action.type) {
        case ADD_TODO:
            return [
                ...state,
                {
                    text: action.text,
                    completed: false,
                },
            ];
        case TOGGLE_TODO:
            return state.map((todo: any, index) => {
                if (index === action.index) {
                    return Object.assign({}, todo, {
                        completed: !todo.completed,
                    });
                }
                return todo;
            });
        default:
            return state;
    }
}

// const todoApp = combineReducers({
//     visibilityFilter,
//     todos,
// });

function todoApp(state: any = {}, action: any) {
    return {
        visibilityFilter: visibilityFilter(state.visibilityFilter, action),
        todos: todos(state.todos, action),
    };
}

export default todoApp;
