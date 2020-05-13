/**
 * 聊天室的文本消息显示
 * @author dodo
 * @date 2020.05.13
 */

import { Component } from "react";
import { ChatMessageElemUnion, ChatMessageElemText } from "../../model/ProtocolTypes";

export default class ChatRoomMessageText extends Component<{ elem: ChatMessageElemUnion }, any> {
    render() {
        return (this.props.elem as ChatMessageElemText).text;
    }
}
