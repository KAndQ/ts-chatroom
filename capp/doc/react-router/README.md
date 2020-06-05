# 核心控件

-   路由(router), 像 `<BrowserRouter>` 和 `<HashRouter>`
-   路由匹配, 像 `<Route>` 和 `<Switch>`
-   导航, 像 `<Link>`, `<NavLink>`, 和 `<Redirect>`

## Hooks

### useHistory

useHistory 钩子允许您访问历史实例，您可以使用该实例导航。

```javascript
import { useHistory } from "react-router-dom";

function HomeButton() {
    let history = useHistory();

    function handleClick() {
        history.push("/home");
    }

    return (
        <button type="button" onClick={handleClick}>
            Go home
        </button>
    );
}
```

### useLocation

useLocation 钩子返回表示当前 URL 的 location 对象。您可以将它看作是一个 useState，它在 URL 发生变化时返回一个新位置。

### useParams

useParams 返回一个 URL 参数的键/值对对象。使用它来访问当前 `<Route>` 的 match.params 参数。

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, useParams } from "react-router-dom";

function BlogPost() {
    let { slug } = useParams();
    return <div>Now showing post {slug}</div>;
}

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/">
                <HomePage />
            </Route>
            <Route path="/blog/:slug">
                <BlogPost />
            </Route>
        </Switch>
    </Router>,
    node
);
```

### useRouteMatch

useRouteMatch 钩子尝试以与 `<Route>` 相同的方式匹配当前 URL。它主要用于在不实际呈现 `<Route>` 的情况下访问匹配数据。

原来的方式:

```javascript
import { Route } from "react-router-dom";

function BlogPost() {
    return (
        <Route
            path="/blog/:slug"
            render={({ match }) => {
                // Do whatever you want with the match...
                return <div />;
            }}
        />
    );
}
```

替换方式:

```javascript
import { useRouteMatch } from "react-router-dom";

function BlogPost() {
    let match = useRouteMatch("/blog/:slug");

    // Do whatever you want with the match...
    return <div />;
}
```

useRouteMatch 钩子接收 1 个参数, 该参数与 matchPath 函数的 props 参数字段相同. 它可以是一个字符串形式的路径名(如上面的例子)，也可以是一个带有路由接受的匹配道具的对象，像这样:

```javascript
const match = useRouteMatch({
    path: "/BLOG/:slug/",
    strict: true,
    sensitive: true,
});
```

## \<BrowserRouter\>

`<Router>` 使用 HTML5 历史 API(pushState, replaceState 和 popstate 事件)保证 UI 和你的 URL 同步.

```javascript
<BrowserRouter
    basename={optionalString}
    forceRefresh={optionalBool}
    getUserConfirmation={optionalFunc}
    keyLength={optionalNumber}>
    <App />
</BrowserRouter>
```

### basename: string

所有位置的基础 URL。如果您的应用程序是从服务器上的子目录中提供的，您将需要将其设置为该子目录。正确格式化的 basename 应该有一个前导斜杠，但没有结尾斜杠。

```javascript
<BrowserRouter basename="/calendar">
    <Link to="/today"/> // renders <a href="/calendar/today">
    <Link to="/tomorrow"/> // renders <a href="/calendar/tomorrow">
    ...
</BrowserRouter>
```

### getUserConfirmation: func

用于确认导航的函数. 默认使用 `window.confirm`.

```javascript
<BrowserRouter
    getUserConfirmation={(message, callback) => {
        // this is the default behavior
        const allowTransition = window.confirm(message);
        callback(allowTransition);
    }}
/>
```

### forceRefresh: bool

如果为真，路由器将在页面导航中使用整个页面刷新。您可能希望使用它来模仿传统服务器呈现的应用程序在页面导航之间刷新整个页面的方式。

```javascript
<BrowserRouter forceRefresh={true} />
```

### keyLength: number

key 的长度。默认为 6

```javascript
<BrowserRouter keyLength={12} />
```

### children: node

要呈现的子元素。

注意: 在 React 16 版本之前, 必须使用一个子元素，因为呈现方法不能返回多个元素。如果需要多个元素，可以尝试将它们包装在一个额外的 `<div>` 中。

## \<HashRouter\>

`<Router>` 使用 URL 的哈希部分(例如: `window.location.hash`)来保证你的 UI 与 URL 同步.

> window.location.hash: Returns the Location object's URL's fragment (includes leading "#" if non-empty). Can be set, to navigate to the same URL with a changed fragment (ignores leading "#").

**重要提示**: 哈希历史记录不支持 `location.key` 或 `location.state`。在以前的版本中，我们试图消除这种行为，但存在无法解决的边缘情况。任何需要这种行为的代码或插件都不能工作。由于这项技术仅用于支持旧浏览器，我们鼓励您配置服务器来使用 `<BrowserHistory>` 代替。

```javascript
<HashRouter basename={optionalString} getUserConfirmation={optionalFunc} hashType={optionalString}>
    <App />
</HashRouter>
```

### basename: string

同 `<BrowserRouter>`

### getUserConfirmation: func

同 `<BrowserRouter>`

### hashType: string

用于 `window.location.hash` 的编码类型。可用值:

-   "slash" - Creates hashes like #/ and #/sunshine/lollipops
-   "noslash" - Creates hashes like # and #sunshine/lollipops
-   "hashbang" - Creates “ajax crawlable” (deprecated by Google) hashes like #!/ and #!/sunshine/lollipops

Defaults to "slash".

### children: node

要呈现的一个子元素。

## \<Link\>

在应用程序周围提供声明性的、可访问的导航。

```javascript
<Link to="/about">About</Link>
```

### to: string

链接位置的字符串表示，通过连接位置的路径名、搜索和散列属性创建。

```javascript
<Link to="/courses?sort=name" />
```

### to: object

一个对象，可以有下列任何属性:

-   pathname: 表示要链接到的路径的字符串.
-   search: 查询参数的字符串表示形式。.
-   hash: 要放在 URL 中的散列, e.g. #a-hash.
-   state: 要持久化到该位置的状态.

```javascript
<Link
    to={{
        pathname: "/courses",
        search: "?sort=name",
        hash: "#the-hash",
        state: { fromDashboard: true },
    }}
/>
```

### to: function

一个函数，当前位置作为参数传递给它，并且应该以字符串或对象的形式返回位置表示.

```javascript
<Link to={location => ({ ...location, pathname: "/courses" })} />
<Link to={location => `${location.pathname}?sort=name`} />
```

### replace: bool

当为 true 时，单击该链接将替换历史堆栈中的当前条目，而不是添加新的条目。

```javascript
<Link to="/courses" replace />
```

### innerRef: function

作为 React Router 5.1, 如果你正在使用 React 16 版本, 那么将不需要这个属性, 因为我们将 ref 转发到底层 `<a>` 标签. 使用普通 ref 代替。

允许访问底层组件的 ref.

```javascript
<Link
    to="/"
    innerRef={(node) => {
        // `node` refers to the mounted DOM element
        // or null when unmounted
    }}
/>
```

### innerRef: RefObject

作为 React Router 5.1, 如果你正在使用 React 16 版本, 那么将不需要这个属性, 因为我们将 ref 转发到底层 `<a>` 标签. 使用普通 ref 代替。

使用 `React.createRef` 获得组件的底层 ref.

```javascript
let anchorRef = React.createRef()

<Link to="/" innerRef={anchorRef} />
```

### component: React.Component

If you would like utilize your own navigation component, you can simply do so by passing it through the component prop.

如果您想使用自己的导航组件，只需通过组件属性传递它即可。

```javascript
const FancyLink = React.forwardRef((props, ref) => (
  <a ref={ref}>💅 {props.children}</a>
))

<Link to="/" component={FancyLink} />
```

### others

你也可以传递类似在 `<a>` 使用的属性，比如 title，id，className 等等。

## \<NavLink\>

一个特殊版本的链接。这将在与当前 URL 匹配时向呈现的元素添加样式属性。

### activeClassName: string

当元素处于活动状态时，要提供的类。默认的给定类是 active。这将与 className 属性连接起来。

```javascript
<NavLink to="/faq" activeClassName="selected">
    FAQs
</NavLink>
```

### activeStyle: object

当元素处于活动状态时应用于元素的样式。

```javascript
<NavLink
    to="/faq"
    activeStyle={{
        fontWeight: "bold",
        color: "red",
    }}>
    FAQs
</NavLink>
```

### exact: bool

当为 true 时，只有在位置完全匹配时，才会应用活动类/样式。

### strict: bool

当为 true 时，在 location.pathname 否与当前 URL 匹配时，将考虑位置路径名的末尾斜杠。看 `<Router strict>` 文档以获取更多信息。

### isActive: func

添加额外逻辑以确定链接是否处于活动状态的函数。除了验证链接的路径名是否与当前 URL 的路径名匹配之外，还应该使用此选项。

```javascript
<NavLink
    to="/events/123"
    isActive={(match, location) => {
        if (!match) {
            return false;
        }

        // only consider an event active if its event id is an odd number
        const eventID = parseInt(match.params.eventID);
        return !isNaN(eventID) && eventID % 2 === 1;
    }}>
    Event 123
</NavLink>
```

### location: object

isActive 比较当前历史位置(通常是当前浏览器的 URL)。为了与不同的位置进行比较，可以传递一个位置。

### aria-current: string

aria-current 属性的值用在激活的链接上. 可用的值:

-   "page" - 用于指示一组分页链接中的链接
-   "step" - 用于在步骤指示符内指示基于步骤的进程的链接
-   "location" - 用于指示在视觉上突出显示为流程图的当前组件的图像
-   "date" - 用于指示日历中的当前日期
-   "time" - 用于指示时间表中的当前时间
-   "true" - 用于指示 NavLink 是否处于活动状态

Defaults to "page".

## \<Prompt\>

用于在导航离开页面之前提示用户。当应用程序进入防止用户导航离开的状态时(比如表单填写了一半)，呈现 \<Prompt\>。

### message: string

当用户试图导航离开时提示的消息。

### message: func

将与用户试图导航到的下一个位置和操作一起调用。返回一个字符串以向用户显示提示，或返回 true 以允许转换。

```javascript
<Prompt
    message={(location, action) => {
        if (action === "POP") {
            console.log("Backing up...");
        }

        return location.pathname.startsWith("/app")
            ? true
            : `Are you sure you want to go to ${location.pathname}?`;
    }}
/>
```

### when: bool

> Instead of conditionally rendering a \<Prompt\> behind a guard, you can always render it but pass when={true} or when={false} to prevent or allow navigation accordingly.

与在警卫后面有条件地呈现 `<Promp>` 不同，您可以始终呈现它，但当={true}或当={false}时通过，以防止或允许相应的导航。

## \<MemoryRouter\>

将你的 URL 存储在内存中的 `<Router>`(不会读写浏览器的地址栏). 常常用于测试费浏览器的环境, 例如: React Native.

### initialEntries: array

历史堆栈中的 location 对象数组. 这些可以是带有{pathname、search、hash、state}或简单字符串 url 的成熟 location 对象。

### initialIndex: number

初始项数组中的初始位置索引。

### getUserConfirmation: func

用于确认导航的函数。 当 `<MemoryRouter>` 与 `<Prompt>` 直接使用时, 您必须直接使用这个选项.

### keyLength: number

同 `<BrowserRouter>`.

### children: node

同 `<BrowserRouter>`.

## \<Redirect\>

呈现一个 `<Redirect>` 将导航到一个新的位置. 新的位置将重写当前历史栈中的内容, 类似服务端的重定向(HTTP 3xx)所做的事情.

```javascript
<Route exact path="/">
    {loggedIn ? <Redirect to="/dashboard" /> : <PublicHomePage />}
</Route>
```

### to: string

被重定向 URL. 可被 `path-to-regexp@^1.7.0` 模块理解的任何 URL. 在 to 中使用的所有 URL 参数必须由 from 覆盖。

### to: object

被重定向的 location 对象. `pathname` 参数需要被 `path-to-regexp@^1.7.0` 模块理解.

```javascript
<Redirect
    to={{
        pathname: "/login",
        search: "?utm=your+face",
        state: { referrer: currentLocation },
    }}
/>
```

`state` 对象能够在被重定向的组件中通过 `this.props.location.state` 获得. 这个新的 `referrer` 字段(它不是个特别的名字)可以在指向的 `/login` 路径的 `Login` 组件中, 通过 `this.props.location.state.referrer` 获得.

### push: bool

当为真时，重定向将把一个新的条目推送到历史中，而不是取代当前的条目。

### from: string

重定向所来自的路径名. 任何 URL 路径都需要能够被 `path-to-regexp@^1.7.0` 模块理解. 在 to 中为模式提供了所有匹配的 URL 参数。必须包含 to 中使用的所有参数。不被 to 使用的其他参数将被忽略。

**注意**: 这只能用于匹配一个 location 对象, 当在 `<Switch>` 内渲染 `<Redirect>` 时. 查看 `<Switch children>` 了解更多的细节.

```javascript
<Switch>
    <Redirect from='/old-path' to='/new-path' />
    <Route path='/new-path'>
        <Place />
    </Route>
</Switch>

// Redirect with matched parameters
<Switch>
    <Redirect from='/users/:id' to='/users/profile/:id'/>
    <Route path='/users/profile/:id'>
        <Profile />
    </Route>
</Switch>
```

### exact: bool

完全匹配, 相当于 Route.exact.

**注意**: 这只能在 `<Swtich>` 里面渲染 `<Redirect>` 时与 from 一起使用，以精确匹配位置。查看 `<Switch children>` 了解更多的细节.

### strict: bool

严格匹配, 相当于 Route.strict.

**注意**: 这只能在 `<Swtich>` 里面渲染 `<Redirect>` 时与 from 一起使用，以严格匹配位置。查看 `<Switch children>` 了解更多的细节.

### sensitive: bool

匹配从区分大小写, 相当于 Route.sensitive.

## \<Route\>
