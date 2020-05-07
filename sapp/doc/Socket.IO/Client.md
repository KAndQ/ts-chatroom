# Client

## IO

```javascript
// 1.
const io = require("socket.io-client");

// 2.
import io from "socket.io-client";
```

### io([url][, options])

-   **Returns** `Socket`

为给定的 URL 创建一个新的 `Manager`，并尝试为后续调用重用一个现有的 `Manager`，除非 `multiplex` 选项被传递为 `false`。传递这个选项相当于传递 `'force new connection': true` 或 `forceNew: true`。

将为 URL 中的路径名指定的命名空间返回一个新的套接字实例，默认为 `/`。例如，如果 url 是 `http://localhost/users`，则将建立到 `http://localhost` 传输连接和一个 `/users` 的 Socket.IO 连接。

还可以通过 Query 选项或直接在 url 中提供查询参数(例如: `http://localhost/users?token=abc`)。

### 初始化

默认情况下，当连接到不同的名称空间(以最小化资源)时，将使用单个连接:

```javascript
const socket = io();
const adminSocket = io("/admin");
// a single connection will be established

const socket = io();
const adminSocket = io("/admin", { forceNew: true });
// will create two distinct connections

const socket = io();
const socket2 = io();
// will also create two distinct connections
```

## Manager

对 url 多路复用的管理. `Manager` 负责创建 `Socket`, Socket 是否是复用的形式由实际的配置项决定.(Manager 这块的介绍有点模糊, 只能猜测出大概的意思).

### new Manager(url[, options])

-   **Returns** `Manager`

### manager.open([callback])/manager.connect([callback])

如果管理器是用 `autoConnect` 为 `false` 启动的，则启动一个新的连接尝试。

`callback` 参数是可选的，将在尝试失败/成功时调用。

### manager.socket(nsp, options)

-   **Return** `Socket`

为给定的命名空间创建一个新的 Socket。

### Events

-   connect_error
-   connect_timeout
-   reconnect
-   reconnect_attempt
-   reconnecting
-   reconnect_error
-   reconnect_failed
-   ping
-   pong

## Socket

### socket.open()/socket.connect()

-   **Return** `Socket`

手动打开 Socket

```javascript
const socket = io({
    autoConnect: false,
});

// ...
socket.open();
```

也可以用于手动的自动重连

```javascript
socket.on("disconnect", () => {
    socket.open();
});
```

### socket.close()/socket.disconnect()

手动断开 Socket

### Events

-   connect

在连接成功和重新连接时触发。

```javascript
socket.on("connect", () => {
    // ...
});

// note: you should register event handlers outside of connect,
// so they are not registered again on reconnection
socket.on("myevent", () => {
    // ...
});
```

-   connect_error
-   connect_timeout
-   error
-   disconnect
-   reconnect
-   reconnect_attempt
-   reconnecting
-   reconnect_error
-   reconnect_failed
-   ping
-   pong
