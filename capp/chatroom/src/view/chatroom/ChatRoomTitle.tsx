/**
 * 聊天室的标题
 * @author dodo
 * @date 2020.05.12
 */

import React, { Component } from "react";
import core from "../../model/Core";
import { EVENT_UPDATE_ROOM_INFO } from "../../model/Events";

interface IState {
    roomId: number;
    roomName: string;
    userName: string;
}

export default class ChatRoomTitle extends Component<any, IState> {
    constructor(props: any) {
        super(props);

        let userName = "";
        if (core.store.myself) {
            userName = core.store.myself.nickname;
        }

        if (core.store.chatRoom) {
            this.state = {
                roomId: core.store.chatRoom.roomId,
                roomName: core.store.chatRoom.roomName,
                userName,
            };
        } else {
            this.state = {
                roomId: 0,
                roomName: "",
                userName,
            };
        }

        this.onUpdateRoomInfo = this.onUpdateRoomInfo.bind(this);
    }

    componentDidMount() {
        core.on(EVENT_UPDATE_ROOM_INFO, this.onUpdateRoomInfo);
    }

    componentWillUnmount() {
        core.off(EVENT_UPDATE_ROOM_INFO, this.onUpdateRoomInfo);
    }

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <span
                    style={{
                        color: "#FFFFFF",
                    }}>{`${this.state.roomName}(我是: `}</span><span style={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        paddingLeft: 4,
                    }}>{this.state.userName})</span>
            </div>
        );
    }

    private onUpdateRoomInfo() {
        if (core.store.chatRoom) {
            this.setState({
                roomId: core.store.chatRoom.roomId,
                roomName: core.store.chatRoom.roomName,
            });
        } else {
            this.setState({
                roomId: 0,
                roomName: "",
            });
        }
    }
}
