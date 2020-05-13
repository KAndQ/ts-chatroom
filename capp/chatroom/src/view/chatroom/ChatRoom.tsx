/**
 * 聊天室视图
 * @author dodo
 * @date 2020.05.09
 */

import ChatRoomTitle from "./ChatRoomTitle";
import ChatRoomOnlineUsers from "./ChatRoomOnlineUsers";
import ChatRoomMessages from "./ChatRoomMessages";
import ChatRoomInput from "./ChatRoomInput";
import React, { Component } from "react";
import { Layout } from "antd";
import NetRoom from "../../net/NetRoom";
import NetMessage from "../../net/NetMessage";
const { Header, Footer, Sider, Content } = Layout;

export default class ChatRoom extends Component {
    componentDidMount() {
        NetRoom.getRoomInfo();
        NetMessage.pullMessages(true);
    }

    render() {
        return (
            <Layout>
                <Header>
                    <ChatRoomTitle />
                </Header>
                <Layout>
                    <Sider
                        theme="light"
                        style={{
                            overflow: "auto",
                            height: 700,
                            left: 0,
                        }}>
                        <ChatRoomOnlineUsers />
                    </Sider>
                    <Layout>
                        <Content>
                            <ChatRoomMessages />
                        </Content>
                        <Footer>
                            <ChatRoomInput />
                        </Footer>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}
