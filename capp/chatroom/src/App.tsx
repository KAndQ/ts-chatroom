import React, { Component } from "react";
import { Alert } from "antd";
import "./App.css";
import core from "./model/Core";
import { EVENT_CHANGE_SCENE, EVENT_ALERT } from "./model/Events";
import { SceneName } from "./model/ProtocolTypes";
import Login from "./view/login/Login";
import ChatRoom from "./view/chatroom/ChatRoom";

type AlertType = "success" | "info" | "warning" | "error" | undefined;

interface IState {
    sceneName: SceneName;
    alert?: {
        text: string;
        type: AlertType;
    };
}

class App extends Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            sceneName: SceneName.Login,
        };

        this.onChangeScene = this.onChangeScene.bind(this);
        this.onAlert = this.onAlert.bind(this);
    }

    componentDidMount() {
        core.on(EVENT_CHANGE_SCENE, this.onChangeScene);
        core.on(EVENT_ALERT, this.onAlert);
    }

    componentWillUnmount() {
        core.off(EVENT_CHANGE_SCENE, this.onChangeScene);
        core.on(EVENT_ALERT, this.onAlert);
    }

    render() {
        let view;
        switch (this.state.sceneName) {
            case SceneName.Login:
                view = <Login />;
                break;
            case SceneName.ChatRoom:
                view = <ChatRoom />;
                break;
        }

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
                {view}
            </div>
        );
    }

    private onChangeScene(sceneName: SceneName): void {
        this.setState({
            sceneName,
        });
    }

    private onAlert(text: string, type: AlertType): void {
        this.setState({
            alert: {
                text,
                type,
            },
        });
    }
}

export default App;
