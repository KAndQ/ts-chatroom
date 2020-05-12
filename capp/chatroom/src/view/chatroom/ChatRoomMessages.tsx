/**
 * 聊天室的消息展示界面
 * @author dodo
 * @date 2020.05.12
 */

import React, { Component } from "react";
import {
    IChatMessage,
    ChatMessageElemUnion,
    ChatMessageElemType,
    ChatMessageElemText,
    IChatUser,
} from "../../model/ProtocolTypes";
import core from "../../model/Core";
import moment from "moment";
import NetUser from "../../net/NetUser";
import { UserOutlined } from "@ant-design/icons";
import { EVENT_PULL_MESSAGES, EVENT_PUSH_MESSAGE } from "../../model/Events";

class ChatRoomMessageHead extends Component<{ uid: number }, { chatUser?: IChatUser }> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const chatUser = await NetUser.getUserInfo({ uid: this.props.uid });
        if (chatUser) {
            this.setState({ chatUser });
        }
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
}

interface IState {
    messages: IChatMessage[];
}

export default class ChatRoomMessages extends Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            messages: core.store.messages.slice(),
        };

        this.onUpdateMessages = this.onUpdateMessages.bind(this);
    }

    componentDidMount() {
        core.on(EVENT_PULL_MESSAGES, this.onUpdateMessages);
        core.on(EVENT_PUSH_MESSAGE, this.onUpdateMessages);
    }

    componentWillUnmount() {
        core.off(EVENT_PULL_MESSAGES, this.onUpdateMessages);
        core.off(EVENT_PUSH_MESSAGE, this.onUpdateMessages);
    }

    render() {
        const messageDivs: any = [];
        this.state.messages.forEach((v, index) => {
            messageDivs.push(
                <div
                    key={index}
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                    }}>
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            height: 32,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        {moment(v.msendTimestamp * 1000).format("YYYY/MM/DD HH:mm:ss")}
                    </div>
                    {this.renderMessage(v)}
                </div>
            );
        });

        return (
            <div
                style={{
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    height: 600,
                }}>
                {messageDivs}
            </div>
        );
    }

    private renderMessage(message: IChatMessage) {
        if (core.store.myself) {
            if (message.fromUid === core.store.myself.uid) {
                return (
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            alignItems: "flex-start",
                        }}>
                        {this.renderMessageElem(message.elem, true)}
                        <ChatRoomMessageHead uid={message.fromUid} />
                    </div>
                );
            } else {
                return (
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                        }}>
                        <ChatRoomMessageHead uid={message.fromUid} />
                        {this.renderMessageElem(message.elem, false)}
                    </div>
                );
            }
        }
    }

    private renderMessageElem(elem: ChatMessageElemUnion, isMyself: boolean) {
        switch (elem.elemType) {
            case ChatMessageElemType.TEXT:
                return (
                    <div
                        style={{
                            width: 360,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: isMyself ? "flex-end" : "flex-start",
                            alignItems: "center",
                        }}>
                        {(elem as ChatMessageElemText).text}
                    </div>
                );
            default:
                return <div>Not implemented</div>;
        }
    }

    private onUpdateMessages() {
        const messages = core.store.messages.slice();
        this.setState({
            messages: messages,
        });
    }
}
