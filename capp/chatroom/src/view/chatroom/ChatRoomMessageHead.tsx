/**
 * 聊天信息的用户头
 * @author dodo
 * @date 2020.05.13
 */

import React, { Component } from "react";
import { IChatUser } from "../../model/ProtocolTypes";
import NetUser from "../../net/NetUser";
import { UserOutlined } from "@ant-design/icons";

export default class ChatRoomMessageHead extends Component<{ uid: number }, { chatUser?: IChatUser }> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const chatUser = await NetUser.getUserInfo({ uid: this.props.uid });
        if (chatUser && !this.m_isUnmount) {
            this.setState({ chatUser });
        }
    }

    componentWillUnmount() {
        this.m_isUnmount = true;
    }

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 100,
                }}>
                <UserOutlined />
                {this.state.chatUser ? this.state.chatUser.nickname : this.props.uid}
            </div>
        );
    }

    private m_isUnmount: boolean = false;
}
