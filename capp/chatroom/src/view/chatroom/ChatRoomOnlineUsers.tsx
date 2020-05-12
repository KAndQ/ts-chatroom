/**
 * 在线用户列表
 * @author dodo
 * @date 2020.05.12
 */

import React, { Component } from "react";
import { IChatUser } from "../../model/ProtocolTypes";
import core from "../../model/Core";
import {
    EVENT_UPDATE_ONLINE_USERS,
    EVENT_OFFLINE_USER,
    EVENT_ONLINE_USER,
} from "../../model/Events";
import { UserOutlined } from "@ant-design/icons";
import * as _ from "lodash";

interface IState {
    onlineUsers: IChatUser[];
}

export default class ChatRoomOnlineUsers extends Component<any, IState> {
    constructor(props: any) {
        super(props);

        const onlineUsers = core.store.chatRoom ? core.store.chatRoom.onlineUsers.slice() : [];
        onlineUsers.sort((a, b) => {
            return a.loginTime - b.loginTime;
        });
        this.state = { onlineUsers };

        this.onUpdateOnlineUsers = this.onUpdateOnlineUsers.bind(this);
        this.onOfflineUser = this.onOfflineUser.bind(this);
        this.onOnlineUser = this.onOnlineUser.bind(this);
    }

    componentDidMount() {
        core.on(EVENT_UPDATE_ONLINE_USERS, this.onUpdateOnlineUsers);
        core.on(EVENT_OFFLINE_USER, this.onOfflineUser);
        core.on(EVENT_ONLINE_USER, this.onOnlineUser);
    }

    componentWillUnmount() {
        core.off(EVENT_UPDATE_ONLINE_USERS, this.onUpdateOnlineUsers);
        core.off(EVENT_OFFLINE_USER, this.onOfflineUser);
        core.off(EVENT_ONLINE_USER, this.onOnlineUser);
    }

    render() {
        const divUsers: any = [];
        this.state.onlineUsers.forEach((v, index) => {
            divUsers.push(
                <div
                    key={index}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <div
                        style={{
                            paddingRight: 8,
                        }}>
                        <UserOutlined />
                    </div>
                    {v.nickname}
                </div>
            );
        });

        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                }}>
                {divUsers}
            </div>
        );
    }

    private onUpdateOnlineUsers() {
        if (core.store.chatRoom) {
            this.setState({
                onlineUsers: core.store.chatRoom.onlineUsers,
            });
        } else {
            this.setState({
                onlineUsers: [],
            });
        }
    }

    private onOfflineUser(chatUser: IChatUser) {
        const onlineUsers = _.remove(this.state.onlineUsers, (v) => {
            return chatUser.uid === v.uid;
        });
        if (onlineUsers.length > 0) {
            this.setState({
                onlineUsers: this.state.onlineUsers.slice(),
            });
        }
    }

    private onOnlineUser(chatUser: IChatUser) {
        const onlineUsers = this.state.onlineUsers.slice();
        onlineUsers.push(chatUser);
        onlineUsers.sort((a, b) => {
            return a.loginTime - b.loginTime;
        });
        this.setState({
            onlineUsers,
        });
    }
}
