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

    render() {
        return (
            <Space>
                <Button
                    type="primary"
                    onClick={() => {
                        this.m_client.connect(() => {
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
                        this.m_client.request(
                            "login",
                            { nickname: "robot1", password: "123456" },
                            (resp: ResponseLogin) => {
                                console.log(resp);
                            }
                        );
                    }}>
                    登录测试
                </Button>
            </Space>
        );
    }

    private m_client: NetClient;
}

export default App;
