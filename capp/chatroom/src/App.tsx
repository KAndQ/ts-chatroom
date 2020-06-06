import React, { Component } from "react";
import { Alert } from "antd";
import "./App.css";
import core from "./model/Core";
import { EVENT_AUTH, EVENT_ALERT } from "./model/Events";
import Login from "./view/login/Login";
import ChatRoom from "./view/chatroom/ChatRoom";
import { Switch, Route, Redirect } from "react-router-dom";
import { IChatUser } from "./model/ProtocolTypes";

type AlertType = "success" | "info" | "warning" | "error" | undefined;

interface IState {
    myself?: IChatUser;
    alert?: {
        text: string;
        type: AlertType;
    };
}

class App extends Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            myself: core.store.myself,
        };
        this.onAlert = this.onAlert.bind(this);
        this.onAuth = this.onAuth.bind(this);
    }

    componentDidMount() {
        core.on(EVENT_ALERT, this.onAlert);
        core.on(EVENT_AUTH, this.onAuth);
    }

    componentWillUnmount() {
        core.off(EVENT_ALERT, this.onAlert);
        core.off(EVENT_AUTH, this.onAuth);
    }

    render() {
        return (
            <div
                className="App"
                style={{
                    height: "100%",
                    width: 900,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                {this.state.alert ? (
                    <Alert message={this.state.alert.text} type={this.state.alert.type} />
                ) : null}
                <Switch>
                    <Route exact path={["/", "/login"]}>
                        {this.state.myself ? <Redirect to="/room" /> : <Login />}
                    </Route>
                    <Route path="/room">
                        {this.state.myself ? <ChatRoom /> : <Redirect to="/login" />}
                    </Route>
                </Switch>
            </div>
        );
    }

    private onAlert(text: string, type: AlertType): void {
        this.setState({
            alert: {
                text,
                type,
            },
        });
    }

    private onAuth(): void {
        this.setState({
            myself: core.store.myself ? { ...core.store.myself } : undefined,
        });
    }
}

export default App;
