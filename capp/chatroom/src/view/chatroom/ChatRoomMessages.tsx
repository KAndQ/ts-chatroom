/**
 * 聊天室的消息展示界面
 * @author dodo
 * @date 2020.05.12
 */

import React, { Component } from "react";
import { IChatMessage, ChatMessageElemUnion, ChatMessageElemType } from "../../model/ProtocolTypes";
import core from "../../model/Core";
import moment from "moment";
import { EVENT_PULL_MESSAGES, EVENT_PUSH_MESSAGE } from "../../model/Events";
import ChatRoomMessageText from "./ChatRoomMessageText";
import ChatRoomMessageHead from "./ChatRoomMessageHead";
import NetMessage from "../../net/NetMessage";
import { Spin, message } from "antd";
import Consts from "../../const/Consts";

interface IState {
    messages: IChatMessage[];
    spinning: boolean;
}

export default class ChatRoomMessages extends Component<any, IState> {
    constructor(props: any) {
        super(props);

        const messages = core.store.messages.slice();
        if (messages.length > 0) {
            this.state = {
                messages,
                spinning: false,
            };
        } else {
            this.state = {
                messages,
                spinning: true,
            };
        }

        this.onPullMessages = this.onPullMessages.bind(this);
        this.onPushMessage = this.onPushMessage.bind(this);
    }

    componentDidMount() {
        core.on(EVENT_PULL_MESSAGES, this.onPullMessages);
        core.on(EVENT_PUSH_MESSAGE, this.onPushMessage);
    }

    componentWillUnmount() {
        core.off(EVENT_PULL_MESSAGES, this.onPullMessages);
        core.off(EVENT_PUSH_MESSAGE, this.onPushMessage);
    }

    componentDidUpdate() {
        if (this.m_divElemModify) {
            this.m_divElemModify = false;

            if (this.m_divElem) {
                this.m_divElem.scrollTop = this.m_divElem.scrollHeight - this.m_divElemHeight;
            }
        }
    }

    render() {
        const messageDivs: any = [];
        this.state.messages.forEach((v, index) => {
            messageDivs.push(
                <div
                    key={v.mid}
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
            <Spin spinning={this.state.spinning}>
                <div
                    style={{
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        height: 600,
                    }}
                    ref={(elem) => {
                        this.m_divElem = elem;
                    }}
                    onWheel={(e) => {
                        const div = e.currentTarget;
                        const deltaY = e.deltaY;
                        if (deltaY < 0) {
                            if (div.scrollTop === 0) {
                                this.pullMessages();
                            }
                        }
                    }}>
                    {messageDivs}
                </div>
            </Spin>
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
                            width: 500,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: isMyself ? "flex-end" : "flex-start",
                            alignItems: "flex-start",
                            wordBreak: "break-all",
                            textAlign: "start",
                        }}>
                        <ChatRoomMessageText elem={elem} />
                    </div>
                );
            default:
                return <div>Not implemented</div>;
        }
    }

    private setMessages(isFirst?: boolean) {
        if (!isFirst && this.m_divElem) {
            this.m_divElemHeight = this.m_divElem.scrollHeight;
            this.m_divElemModify = true;
        }

        const messages = core.store.messages.slice();
        this.setState({
            messages,
        });
    }

    private onPullMessages(isFirst: boolean, count: number) {
        this.setMessages(isFirst);
        if (isFirst) {
            this.scrollToEnd();
        } else {
            if (count === 0) {
                message.info("已经没有更多的历史消息了");
            }
        }

        const elapse = Date.now() - this.m_requestTimestamp;
        if (elapse >= Consts.PULL_MESSAGES_FIXED_WAIT_TIME) {
            this.setState({
                spinning: false,
            });
        } else {
            setTimeout(() => {
                this.setState({
                    spinning: false,
                });
            }, Consts.PULL_MESSAGES_FIXED_WAIT_TIME - elapse);
        }
    }

    private onPushMessage() {
        this.setMessages();
        this.scrollToEnd();
    }

    private scrollToEnd() {
        if (this.m_divElem) {
            const scrollHeight = this.m_divElem.scrollHeight; //里面 div 的实际高度
            const height = this.m_divElem.clientHeight; // 实际可见高度
            const maxScrollTop = scrollHeight - height;
            this.m_divElem.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
            //如果实际高度大于可见高度，说明是有滚动条的，则直接把网页被卷去的高度设置为两个div的高度差，实际效果就是滚动到底部了。
        }
    }

    private pullMessages() {
        if (this.state.spinning) {
            return;
        }

        NetMessage.pullMessages();
        this.setState({
            spinning: true,
        });

        this.m_requestTimestamp = Date.now();
    }

    private m_divElem: HTMLDivElement | null = null;
    private m_divElemHeight: number = 0;
    private m_divElemModify: boolean = false;
    private m_requestTimestamp: number = 0;
}
