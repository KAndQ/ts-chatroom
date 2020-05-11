import React, { Component } from "react";
import { Button, Space } from "antd";
import "../App.css";
import NetClient from "../net/NetClient";
import Dev from "../utils/Dev";
import { ResponseLogin } from "../model/ProtocolTypes";

class App extends Component {
    constructor(props: Readonly<{}>) {
        super(props);
        this.m_client = new NetClient();
    }

    subscribe() {
        this.m_client.subscribe("pushChatUserStatus", (resp) => {
            console.log("pushChatUserStatus", resp);
        });

        this.m_client.subscribe("pushMessage", (resp) => {
            console.log("pushMessage", resp);
        });
    }

    render() {
        return (
            <Space>
                <Button
                    type="primary"
                    onClick={() => {
                        this.m_client.connect(() => {
                            this.subscribe();
                            Dev.print("NetClientApp", "connect to server");
                        });
                    }}>
                    连接测试
                </Button>
                <Button
                    type="primary"
                    onClick={() => {
                        this.m_client.ping();
                    }}>
                    ping
                </Button>
                <Button
                    type="primary"
                    onClick={() => {
                        this.m_client.connect(() => {
                            this.subscribe();
                            this.m_client.request(
                                "login",
                                { nickname: "robot1", password: "123456" },
                                (resp: ResponseLogin) => {
                                    console.log("login robot1", resp);
                                }
                            );
                        });
                    }}>
                    登录 robot1
                </Button>
                <Button
                    type="primary"
                    onClick={() => {
                        this.m_client.connect(() => {
                            this.subscribe();
                            this.m_client.request(
                                "login",
                                { nickname: "robot2", password: "123456" },
                                (resp: ResponseLogin) => {
                                    console.log("login robot2", resp);
                                }
                            );
                        });
                    }}>
                    登录 robot2
                </Button>
                <Button
                    type="primary"
                    onClick={() => {
                        this.m_client.connect(() => {
                            this.subscribe();
                            this.m_client.request(
                                "login",
                                { nickname: "robot3", password: "123456" },
                                (resp: ResponseLogin) => {
                                    console.log("login robot3", resp);
                                }
                            );
                        });
                    }}>
                    登录 robot3
                </Button>
            </Space>
        );
    }

    private m_client: NetClient;
}

export default App;
