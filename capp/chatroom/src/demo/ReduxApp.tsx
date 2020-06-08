import React, { Component } from "react";
import "../App.css";
import { createStore, Action, combineReducers } from "redux";
import { Button } from "antd";

interface IItem {
    id: number;
    name: string;
    count: number;
}

interface IReduxState {
    label: string;
    items: IItem[];
}

interface IActionLabel extends Action {
    type: "label";
    label: string;
}

interface IActionItems extends Action {
    type: "items";
    items: IItem[];
}

function reduceLabel(state = "", action: IActionLabel): string {
    if (action.type === "label") {
        return action.label;
    }
    return state;
}

function reduceItems(state = [], action: IActionItems): IItem[] {
    if (action.type === "items") {
        return action.items;
    }
    return state;
}

const rootReducer = combineReducers({ label: reduceLabel, items: reduceItems });
const store = createStore(rootReducer);

interface IReduxAppState {
    label: string;
    items: IItem[];
}

export default class ReduxApp extends Component<any, IReduxAppState> {
    constructor(props: any) {
        super(props);

        this.state = {
            label: this.m_count.toString(),
            items: [],
        };
    }

    componentDidMount() {
        store.subscribe(() => {
            const state = store.getState();
            this.setState(state);
        });

        store.dispatch({ type: "label", label: this.m_count.toString() });
        store.dispatch({ type: "items", items: this.state.items });
    }

    render() {
        const itemChildren: any = [];
        this.state.items.forEach((item, index) => {
            itemChildren.push((
                <div key={index}>
                    {`id: ${item.id}, name: ${item.name}, count: ${item.count}`}
                </div>
            ));
        });

        return (
            <div>
                Run! Fast Run! Gump!
                <br />
                label: {this.state.label}
                <br />

                <Button
                    onClick={() => {
                        store.dispatch({ type: "label", label: (++this.m_count).toString() });
                    }}
                    type="primary">
                    modify label
                </Button>
                <br />
                <br />
                <Button
                    onClick={() => {
                        this.state.items.push({
                            id: this.m_count,
                            name: "item" + this.m_count,
                            count: Math.floor(Math.random() * 100),
                        });
                        store.dispatch({
                            type: "items",
                            items: this.state.items,
                        });
                    }}
                    type="primary">
                    add item
                </Button>
                <br />
                items:
                <br />
                {itemChildren}
                <br />
            </div>
        );
    }

    private m_count: number = 0;
}
