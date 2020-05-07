# Server

## Server

### Create Cheat Sheet

```javascript
// 1.
{
    const io = require("socket.io")();
}

// 2.
{
    const Server = require("socket.io");
    const io = new Server();
}

// 3.
{
    const server = require("http").createServer();

    const io = require("socket.io")(server, {
        path: "/test",
        serveClient: false,
        // below are engine.IO options
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false,
    });

    server.listen(3000);
}

// 4.
{
    const io = require("socket.io")(3000, {
        path: "/test",
        serveClient: false,
        // below are engine.IO options
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false,
    });
}

// 5.
{
    const io = require("socket.io")({
        path: "/test",
        serveClient: false,
    });

    // either
    {
        const server = require("http").createServer();

        io.attach(server, {
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
        });

        server.listen(3000);
    }

    // or
    {
        io.attach(3000, {
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
        });
    }
}
```

### Events

-   connect

```javascript
io.on("connect", (socket) => {
    // ...
});

io.of("/admin").on("connect", (socket) => {
    // ...
});
```

-   connection(与 connect 同义)

## Namespace/Room

客户机总是连接到 `/` (主名称空间)，然后可能连接到其他名称空间(同时使用相同的底层连接)。

**注意:** 从名称空间发出时不支持(ack)确认。

### in server

```javascript
const Server = require("socket.io");
const io = Server(3030);
const namespace = io.of("/path");

namespace.to("roomName").emit("eventName", { data: "some data" });
// in 是 to 方法的同义词, 即功能相同
namespace.in("roomName").emit("eventName", { data: "some data" });
```

## Socket

并不是我们平常所理解的 TCP/IP Socket, 它只是个类名. 其底层是 engine.io 的 `Client` 实现的.

套接字类继承自 EventEmitter。套接字类覆盖 emit 方法，并且不修改任何其他 EventEmitter 方法。这里记录的所有方法(除了 emit 之外)都是由 EventEmitter 实现的，并且适用于 EventEmitter 的文档。

### socket.send([…args][, ack])

Sends a message event. See socket.emit(eventName[, …args][, ack]).

### socket.join(room[, callback])

Adds the client to the room, and fires optionally a callback with err signature (if any).

```javascript
io.on("connection", (socket) => {
    socket.join("room 237", () => {
        let rooms = Object.keys(socket.rooms);
        console.log(rooms); // [ <socket.id>, 'room 237' ]
        io.to("room 237").emit("a new user has joined the room"); // broadcast to everyone in the room
    });
});
```

为方便起见，每个套接字自动加入一个由其 id 标识的房间(请参阅套接字#id)。这使得它很容易广播消息到其他套接字:

```javascript
io.on("connection", (socket) => {
    socket.on("say to someone", (id, msg) => {
        // send a private message to the socket with the given id
        socket.to(id).emit("my message", msg);
    });
});
```

### socket.join(rooms[, callback])

```javascript
io.on("connection", (socket) => {
    socket.join(["room 237", "room 238"], () => {
        const rooms = Object.keys(socket.rooms);
        console.log(rooms); // [ <socket.id>, 'room 237', 'room 238' ]
        io.to("room 237").to("room 238").emit("a new user has joined the room"); // broadcast to everyone in both rooms
    });
});
```

### socket.leave(room[, callback])

```javascript
io.on("connection", (socket) => {
    socket.leave("room 237", () => {
        io.to("room 237").emit(`user ${socket.id} has left the room`);
    });
});
```

**房间一旦断开就会自动离开。**

### socket.to(room)/socket.in(room)

为随后的事件发射设置一个修饰符，该事件将仅广播给已加入给定房间的客户端(Socket 本身被排除在外)。

要发射到多个房间，你可以调用多次。

以下 `to` 接口调用的地方都可以使用 `in` 接口替换.

```javascript
io.on("connection", (socket) => {
    // to one room
    socket.to("others").emit("an event", { some: "data" });

    // to multiple rooms
    socket.to("room1").to("room2").emit("hello");

    // a private message to another socket
    socket.to(/* another socket id */).emit("hey");

    // WARNING: `socket.to(socket.id).emit()` will NOT work, as it will send to everyone in the room
    // named `socket.id` but the sender. Please use the classic `socket.emit()` instead.
});
```

### Events

-   disconnect

Fired upon disconnection.

```javascript
io.on("connection", (socket) => {
    socket.on("disconnect", (reason) => {
        // ...
    });
});
```

-   error

发生错误时触发。

```javascript
io.on("connection", (socket) => {
    socket.on("error", (error) => {
        // ...
    });
});
```

-   disconnecting

在客户端将要断开连接(但尚未离开其房间)时触发。

```javascript
io.on("connection", (socket) => {
    socket.on("disconnecting", (reason) => {
        let rooms = Object.keys(socket.rooms);
        // ...
    });
});
```

## Client

最底层的通信实现.

Client 类表示传入传输(engine.io)连接。一个客户端可以与许多属于不同名称空间的多路复用套接字相关联。
