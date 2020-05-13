/**
 * 登录界面
 * @author dodo
 * @date 2020.05.09
 */

import React, { Component } from "react";
import { Button, Input, Spin, message } from "antd";
import core from "../../model/Core";
import { EVENT_CHANGE_SCENE } from "../../model/Events";
import { SceneName } from "../../model/ProtocolTypes";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import Dev from "../../utils/Dev";
import NetUser from "../../net/NetUser";
import NetMessage from "../../net/NetMessage";

interface IState {
    name?: string;
    password?: string;
    loading: boolean;
}

export default class Login extends Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            name: core.defaultName,
            password: core.defaultPassword,
            loading: false,
        };
    }

    render() {
        const style = {
            display: "flex",
            width: "100%",
            height: 40,
            padding: 16,
            justifyContent: "center",
            alignItems: "center",
        };

        // name
        const viewName = (
            <div style={style}>
                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        paddingRight: 10,
                    }}>
                    用户名:
                </div>
                <div
                    style={{
                        display: "flex",
                        flex: 4,
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}>
                    <Input
                        maxLength={16}
                        placeholder="请输入用户名"
                        prefix={<UserOutlined />}
                        value={this.state.name}
                        onChange={(e) => {
                            this.setState({
                                name: e.target.value,
                            });
                        }}
                    />
                </div>
            </div>
        );

        // password
        const viewPassword = (
            <div style={style}>
                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        paddingRight: 10,
                    }}>
                    密码:
                </div>
                <div
                    style={{
                        display: "flex",
                        flex: 4,
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}>
                    <Input.Password
                        maxLength={8}
                        placeholder="请输入密码"
                        prefix={<KeyOutlined />}
                        value={this.state.password}
                        onChange={(e) => {
                            this.setState({
                                password: e.target.value,
                            });
                        }}
                        onPressEnter={() => {
                            this.login();
                        }}
                    />
                </div>
            </div>
        );

        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: "0px",
                    bottom: "0px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Spin spinning={this.state.loading}>
                    <div
                        style={{
                            width: 320,
                            height: 180,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}>
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                flex: 2,
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                            {viewName}
                            {viewPassword}
                        </div>

                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                            <Button type="primary" onClick={() => this.login()}>
                                登录
                            </Button>
                        </div>
                    </div>
                </Spin>
            </div>
        );
    }

    private login() {
        if (this.state.name === undefined || this.state.name.trim().length === 0) {
            message.error("用户名不能为空");
            return;
        }

        if (this.state.password === undefined || this.state.name?.trim().length === 0) {
            message.error("密码不能为空");
            return;
        }

        this.setState({
            loading: true,
        });
        Dev.print("Login", `name = ${this.state.name}, password = ${this.state.password}`);

        core.client.connect(async () => {
            if (this.state.name && this.state.password) {
                NetUser.subscribePushChatUserStatus();
                NetMessage.subscribePushMessage();

                const rep = await NetUser.login({
                    nickname: this.state.name,
                    password: this.state.password,
                });
                if (rep.errString) {
                    message.error(rep.errString);

                    this.setState({
                        loading: false,
                    });
                } else {
                    core.emit(EVENT_CHANGE_SCENE, SceneName.ChatRoom);
                }
            } else {
                message.error("不可思议!!!");
            }
        });
    }
}
