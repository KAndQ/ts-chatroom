# PROTOCOL

使用 TypeScript 语法作为协议定义描述语言.

## I. Data Struct

### ChatUser

```TypeScript
class {
    uid: number; // id
    nickname: string; // 昵称
    password: string; // 密码
}
```

### ChatMessage

```TypeScript
class {
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

class ChatMessageElem {
    elemType: ChatMessageElemType;
}

class ChatMessageElemText extends ChatMessageElem {
    text: string;
}

class ChatMessageElemEmotion extends ChatMessageElem {
    index: number;
}

class ChatMessageElemLink extends ChatMessageElem {
    url: string;
}

class ChatMessageElemFile extends ChatMessageElem {
    url: string;
}

class ChatMessageElemImage extends ChatMessageElem {
    url: string;
}
```

## II. Request/Response

### 登录 login

```TypeScript
class RequestLogin {
    nickname: string;
    password: string;
}

class ResponseLogin {
    chatUser?: ChatUser; // 成功有值
    errString?: string; // 不成功有值, 错误原因
}
```
