import core from "../model/Core";
import { IChatMessage, ChatMessageElemType } from "../model/ProtocolTypes";

const store = core.store;

store.chatRoom = {
    roomName: "这是测试房间数据",
    roomId: 777,
    onlineUsers: [],
};

const MAX_USERS = 100;
for (let i = 0; i < MAX_USERS; ++i) {
    store.chatRoom.onlineUsers.push({
        nickname: "robot" + i,
        uid: i,
        password: "123456",
        loginTime: Math.floor(Date.now() / 1000),
        logoutTime: Math.floor(Date.now() / 1000),
    });

    if (i === 1) {
        store.myself = store.chatRoom.onlineUsers[i];
    }
}

const MAX_MESSAGES = 100;
for (let i = 0; i < MAX_MESSAGES; ++i) {
    const message: IChatMessage = {
        mid: i,
        fromUid: store.chatRoom.onlineUsers[Math.floor(Math.random() * MAX_USERS)].uid,
        msendTimestamp: Math.floor(Date.now() / 1000) - Math.random() * 10000 + Math.random() * 20000,
        elem: { elemType: ChatMessageElemType.TEXT, text: `消息消息消息 ${i}` },
    };

    store.messages.push(message);
}
