# PROTOCOL

使用 TypeScript 作为协议数据定义描述语言.

## I. Data Struct

### ChatUser

```TypeScript
interface {
    uid: number; // id
    nickname: string; // 昵称
    password: string; // 密码
}
```

### ChatMessage

```TypeScript
interface ChatMessage {
    fromChatUser: ChatUser; // 发送用户
    timestamp: number; // 发送时间戳
    elment: ChatMessageElem; // 发送元素
}
```

### ChatMessageElem

```TypeScript
enum ChatMessageElemType {
    TEXT, // 文本
    EMOTION, // 表情
    LINK, // 链接
    FILE, // 文件
    IMAGE, // 图片
}

interface ChatMessageElem {
    elemType: ChatMessageElemType;
}

interface ChatMessageElemText extends ChatMessageElem {
    text: string;
}

interface ChatMessageElemEmotion extends ChatMessageElem {
    index: number;
}

interface ChatMessageElemLink extends ChatMessageElem {
    url: string;
}

interface ChatMessageElemFile extends ChatMessageElem {
    url: string;
}

interface ChatMessageElemImage extends ChatMessageElem {
    url: string;
}

type ChatMessageElemUnion = ChatMessageElemText | ChatMessageElemEmotion | ChatMessageElemLink | ChatMessageElemFile | ChatMessageElemImage;
```

## II. Request/Response

### 登录 login

- [x] HTTP
- [x] socket
- [x] websocket

```TypeScript
interface RequestLogin {
    nickname: string;
    password: string;
}

interface ResponseLogin {
    chatUser?: ChatUser; // 成功有值
    errString?: string; // 不成功有值, 错误原因
}
```

### 心跳 heartbeat

- [x] HTTP
- [x] socket
- [x] websocket

```TypeScript
interface RequestHeartbeat {
}

interface ResponseHeartbeat {
}
```

### 发送消息 sendMessage

- [x] HTTP
- [x] socket
- [x] websocket

```TypeScript
interface RequestSendMessage {
    message: ChatMessageElemUnion;
}

interface ResponseSendMessage {
    success: boolean;
}
```

### 服务器推送消息 pushMessage

- [ ] HTTP
- [x] socket
- [x] websocket

```TypeScript
interface RequestSendMessage {
    message: ChatMessageElemUnion;
}
```

### 从服务器拉取聊天信息 pullMessages

- [x] HTTP
- [x] socket
- [x] websocket

```TypeScript
interface RequestPullMessages {
    timestamp?: number; // 不传表示拉取最新的信息
    count: number; // 拉取消息的数量
}

interface ResponsePullMessages {
    messages: ChatMessage[];
}
```

### 上传文件 uploadFile

使用 http 协议上传文件, 返回文件的下载地址

### 上传图片 uploadImage

使用 http 协议上传图片, 返回图片的下载地址

### 请求在线用户列表 getOnlineUserList

```TypeScript
interface RequestGetOnlineUserList {
}

interface ResponseGetOnlineUserList {
    chatUsers: ChatUser[];
}
```

### 用户上线/下线推送 pushChatUserStatus

```TypeScript
enum ChatUserStatus {
    ONLINE,
    OFFLINE,
}

interface RequestPushChatUserStatus {
    chatUser: ChatUser;
    status: ChatUserStatus;
}
```
