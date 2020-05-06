# Socket.IO 简介

## 支持自动重连

除非另有指示，否则断开连接的客户端将尝试永远重新连接，直到服务器再次可用。

## 断开检测

心跳机制在引擎中实现。IO 级别，允许服务器和客户端知道对方何时不再响应。

该功能是通过在服务器和客户机上设置计时器，并在连接握手期间共享超时值(pingInterval 和 pingTimeout 参数)来实现的。这些定时器要求任何后续的客户端调用都指向相同的服务器，因此在使用多个节点时需要 `sticky-session`。

## 支持二进制

-   `ArrayBuffer` and `Blob` in browser
-   `ArrayBuffer` and `Buffer` in Node.js

## 支持多路复用

为了在您的应用程序中创建关注点分离(例如每个模块，或者基于权限)，Socket.IO 允许您创建多个名称空间，这些名称空间将作为单独的通信通道，但将共享相同的底层连接。

## Rooms

在每个名称空间中，您可以定义任意的通道，即 Socket 可以连接和离开的房间。然后，您可以向任何给定的房间广播，到达连接它的每个 Socket。

这是一个非常有用的功能, 例如给一组用户发送数据, 或者给一个用户连接的若干设备发送消息.

```javascript
io.on("connection", function (socket) {
    // emit an event to the socket
    // 点对点发送消息
    socket.emit("request");

    // emit an event to all connected sockets
    // 给所有连接的 socket 发送消息
    io.emit("broadcast");

    // 接收 reply 消息
    socket.on("reply", function () {});
});
```

## Socket.IO 不支持的内容

Socket.IO 不是一个 WebSocket 实现. 虽然 Socket.IO 确实在有可能的情况下使用 WebSocket 进行传输, 但是它会在每个数据包中增加一些元数据; 数据包的类型, 命名空间和当一个消息需要确认时数据包的 id. 这就是为什么 WebScoket 客户端不能成功连接 Socket.IO 服务端, 并且 Socket.IO 客户端也不能直接连接 WebSocket 服务端.

## 安装

### Server

```bash
npm install socket.io
```

### client

```bash
npm install socket.io-client
```

## 与 Node.js 的 http server 一同使用

### server

```javascript
const app = require("http").createServer(handler);
const io = require("socket.io")(app);
const fs = require("fs");

app.listen(80);

function handler(req, res) {
    fs.readFile(__dirname + "/index.html", (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end("Error loading index.html");
        }

        res.writeHead(200);
        res.end(data);
    });
}

io.on("connection", (socket) => {
    socket.emit("news", { hello: "world" });
    socket.on("my other event", (data) => {
        console.log(data);
    });
});
```

### client(index.html)

```html
<script src="/socket.io/socket.io.js"></script>
<script>
    const socket = io("http://localhost");
    socket.on("news", (data) => {
        console.log(data);
        socket.emit("my other event", { my: "data" });
    });
</script>
```

## 发送/接收数据

Socket.IO 允许你发送和接收自定义的事件. 除了 `connect`, `connection`(在客户端无效), `message`, `disconnect` 外.

```javascript
// note, io(<port>) will create a http server for you
const io = require("socket.io")(80);

io.on("connection", (socket) => {
    io.emit("this", { will: "be received by everyone" });

    socket.on("private message", (from, msg) => {
        console.log("I received a private message by ", from, " saying ", msg);
    });

    socket.on("disconnect", () => {
        io.emit("user disconnected");
    });
});
```

## 将自己限制在一个名称空间中

如果您可以控制为特定应用程序发出的所有消息和事件，则可以使用默认的/名称空间。如果您想利用第三方代码，或者生成与他人共享的代码，Socket.IO 提供了一种对套接字进行命名空间的方法。

有着多路复用一个连接的好处.

### Server

```javascript
const io = require("socket.io")(80);
const chat = io.of("/chat").on("connection", (socket) => {
    socket.emit("a message", {
        that: "only",
        "/chat": "will get",
    });
    chat.emit("a message", {
        everyone: "in",
        "/chat": "will get",
    });
});

const news = io.of("/news").on("connection", (socket) => {
    socket.emit("item", { news: "item" });
});
```

### client

```html
<script>
    const chat = io.connect("http://localhost/chat"),
        news = io.connect("http://localhost/news");

    chat.on("connect", () => {
        chat.emit("hi!");
    });

    news.on("news", () => {
        news.emit("woot");
    });
</script>
```

## 发送不稳定的消息

有时某些消息会被删除。让我们假设你有一个应用程序，为关键字 `bieber` 显示实时的 tweets.

如果某个客户端没有准备好接收消息(因为网络慢或其他问题，或者因为它们是通过长轮询连接的，并且处于请求-响应周期的中间)，就算它没有接收到与 `bieber` 相关的所有 tweet，应用程序就不会受到影响。

### server

```javascript
const io = require("socket.io")(80);

io.on("connection", (socket) => {
    const tweets = setInterval(() => {
        getBieberTweet((tweet) => {
            socket.volatile.emit("bieber tweet", tweet);
        });
    }, 100);

    socket.on("disconnect", () => {
        clearInterval(tweets);
    });
});
```

## 发送和获取数据(确认)

有时，您可能希望在客户端确认消息接收时获得回调。

为此，只需传递一个函数作为 `.send` 或 `.emit` 的最后一个参数。更重要的是，当你使用 `.emit` 时，确认是由你来完成的，这意味着你也可以将数据传递下去:

### server

```javascript
const io = require("socket.io")(80);

io.on("connection", (socket) => {
    socket.on("ferret", (name, word, fn) => {
        fn(name + " says " + word);
    });
});
```

### client

```html
<script>
    const socket = io(); // TIP: io() with no args does auto-discovery
    socket.on("connect", () => {
        // TIP: you can avoid listening on `connect` and listen on events directly too!
        socket.emit("ferret", "tobi", "woot", (data) => {
            // args are sent in order to acknowledgement function
            console.log(data); // data will be 'tobi says woot'
        });
    });
</script>
```

## 广播消息

要进行广播，只需添加 `broadcast` 标志来 `emit` 和 `send` 方法调用。广播意味着向除启动它的 `socket` 之外的其他所有人发送消息。

### server

```javascript
const io = require("socket.io")(80);

io.on("connection", (socket) => {
    socket.broadcast.emit("user connected");
});
```

## 像跨平台的 WebSocket 那样使用

如果只需要 WebSocket 语义，也可以这样做。简单地利用 `send` 和侦听 `message` 事件:

### server

```javascript
const io = require("socket.io")(80);

io.on("connection", (socket) => {
    socket.on("message", () => {});
    socket.on("disconnect", () => {});
});
```

### client

```html
<script>
    const socket = io("http://localhost/");
    socket.on("connect", () => {
        socket.send("hi");

        socket.on("message", (msg) => {
            // my msg
        });
    });
</script>
```
