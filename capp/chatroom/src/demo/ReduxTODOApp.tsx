import React, { Component } from "react";
import "../App.css";
import { createStore } from "redux";
import todoApp from "./ReduxReducers";
import { addTodo, toggleTodo, setVisibilityFilter, VisibilityFilters } from "./ReduxActions";
import { connect, Provider } from "react-redux";

const store = createStore(todoApp);

/* play store
// 打印初始状态
console.log(store.getState());

// 每次 state 更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
const unsubscribe = store.subscribe(() => console.log(store.getState()));

// 发起一系列 action
store.dispatch(addTodo("Learn about actions"));
store.dispatch(addTodo("Learn about reducers"));
store.dispatch(addTodo("Learn about store"));
store.dispatch(toggleTodo(0));
store.dispatch(toggleTodo(1));
store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED));

// 停止监听 state 更新
unsubscribe();
*/

// Todo
const Todo = ({
    onClick,
    completed,
    text,
}: {
    onClick: () => void;
    completed: boolean;
    text: string;
}) => (
    <li
        onClick={onClick}
        style={{
            textDecoration: completed ? "line-through" : "none",
        }}>
        {text}
    </li>
);

// TodoList
const TodoList = ({
    todos,
    onTodoClick,
}: {
    todos: any[];
    onTodoClick: (index: number) => void;
}) => (
    <ul>
        {todos.map((todo: any, index: number) => (
            <Todo key={index} {...todo} onClick={() => onTodoClick(index)} />
        ))}
    </ul>
);

// Link
const Link = ({
    active,
    children,
    onClick,
}: {
    active: boolean;
    children: Component[];
    onClick: () => void;
}) => {
    if (active) {
        return <span>{children}</span>;
    }

    return (
        <a
            href=""
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}>
            {children}
        </a>
    );
};

const getVisibleTodos = (todos: any[], filter: string) => {
    switch (filter) {
        case "SHOW_COMPLETED":
            return todos.filter((t) => t.completed);
        case "SHOW_ACTIVE":
            return todos.filter((t) => !t.completed);
        case "SHOW_ALL":
        default:
            return todos;
    }
};

// 注意返回的是 { todos }
const listMapStateToProps = (state: any) => {
    return {
        todos: getVisibleTodos(state.todos, state.visibilityFilter),
    };
};

// 注意返回的是 { onTodoClick }
const listMapDispatchToProps = (dispatch: any) => {
    return {
        onTodoClick: (id: number) => {
            dispatch(toggleTodo(id));
        },
    };
};

const VisibleTodoList = connect(listMapStateToProps, listMapDispatchToProps)(TodoList);

const linkMapStateToProps = (state: any, ownProps: any) => {
    return {
        active: ownProps.filter === state.visibilityFilter,
    };
};

const linkMapDispatchToProps = (dispatch: any, ownProps: any) => {
    return {
        onClick: () => {
            dispatch(setVisibilityFilter(ownProps.filter));
        },
    };
};

const FilterLink = connect(linkMapStateToProps, linkMapDispatchToProps)(Link);

// Footer
const Footer = () => (
    <p>
        Show: <FilterLink filter="SHOW_ALL">All</FilterLink>
        {", "}
        <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
        {", "}
        <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
    </p>
);

// AddTodo
let AddTodo: any = ({ dispatch }: { dispatch: any }) => {
    let input: any;

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!input.value.trim()) {
                        return;
                    }
                    dispatch(addTodo(input.value));
                    input.value = "";
                }}>
                <input
                    ref={(node) => {
                        input = node;
                    }}
                />
                <button type="submit">Add Todo</button>
            </form>
        </div>
    );
};
AddTodo = connect()(AddTodo);

export default class ReduxTODOApp extends Component {
    render() {
        return (
            <Provider store={store}>
                <div>
                    <AddTodo />
                    <VisibleTodoList />
                    <Footer />
                </div>
            </Provider>
        );
    }
}
