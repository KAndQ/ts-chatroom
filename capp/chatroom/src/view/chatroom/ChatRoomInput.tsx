/**
 * 聊天室输入框
 * @author dodo
 * @date 2020.05.12
 */

import React, { Component } from "react";
import { Input, Button, message } from "antd";
import NetMessage from "../../net/NetMessage";
import { SmileOutlined } from "@ant-design/icons";
const { TextArea } = Input;

export default class ChatRoomInput extends Component<any, { text: string }> {
    constructor(props: any) {
        super(props);
        this.state = { text: "" };
    }

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <div
                    style={{
                        paddingRight: 12,
                    }}>
                    <SmileOutlined
                        style={{
                            fontSize: 24,
                        }}
                        onClick={() => {
                            message.warn("TODO");
                        }}
                    />
                </div>
                <TextArea
                    value={this.state.text}
                    onChange={(e) => {
                        this.setState({ text: e.target.value });
                    }}
                    placeholder="请输入聊天信息"
                    autoSize={{ minRows: 1, maxRows: 7 }}
                    onKeyDown={(e) => {
                        if (e.ctrlKey && e.keyCode === 13) {
                            this.m_isSend = true;
                        }
                    }}
                    onKeyUp={(e) => {
                        if (e.ctrlKey && e.keyCode === 13) {
                            if (this.m_isSend) {
                                this.sendMessage();
                            }
                        }
                    }}
                />
                <div
                    style={{
                        paddingLeft: 12,
                    }}>
                    <Button type="primary" onClick={() => this.sendMessage()}>
                        发送(Ctrl+Enter)
                    </Button>
                </div>
            </div>
        );
    }

    /// 发送消息
    private sendMessage() {
        if (this.state.text === "") {
            message.info("无法检索到消息实体");
        } else {
            NetMessage.sendText(this.state.text).then((value) => {
                if (value) {
                    console.log("Congratulation! Send success!");
                } else {
                    message.error("消息发送失败");
                }
            });
            this.setState({ text: "" });
        }
    }

    private m_isSend: boolean = false;
}
