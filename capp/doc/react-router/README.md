# 核心控件

-   路由(router), 像 `<BrowserRouter>` 和 `<HashRouter>`
-   路由匹配, 像 `<Route>` 和 `<Switch>`
-   导航, 像 `<Link>`, `<NavLink>`, 和 `<Redirect>`

- [核心控件](#核心控件)
    - [Hooks](#hooks)
        - [useHistory](#usehistory)
        - [useLocation](#uselocation)
        - [useParams](#useparams)
        - [useRouteMatch](#useroutematch)
    - [\<BrowserRouter\>](#browserrouter)
        - [basename: string](#basename-string)
        - [getUserConfirmation: func](#getuserconfirmation-func)
        - [forceRefresh: bool](#forcerefresh-bool)
        - [keyLength: number](#keylength-number)
        - [children: node](#children-node)
    - [\<HashRouter\>](#hashrouter)
        - [basename: string](#basename-string-1)
        - [getUserConfirmation: func](#getuserconfirmation-func-1)
        - [hashType: string](#hashtype-string)
        - [children: node](#children-node-1)
    - [\<Link\>](#link)
        - [to: string](#to-string)
        - [to: object](#to-object)
        - [to: function](#to-function)
        - [replace: bool](#replace-bool)
        - [innerRef: function](#innerref-function)
        - [innerRef: RefObject](#innerref-refobject)
        - [component: React.Component](#component-reactcomponent)
        - [others](#others)
    - [\<NavLink\>](#navlink)
        - [activeClassName: string](#activeclassname-string)
        - [activeStyle: object](#activestyle-object)
        - [exact: bool](#exact-bool)
        - [strict: bool](#strict-bool)
        - [isActive: func](#isactive-func)
        - [location: object](#location-object)
        - [aria-current: string](#aria-current-string)
    - [\<Prompt\>](#prompt)
        - [message: string](#message-string)
        - [message: func](#message-func)
        - [when: bool](#when-bool)
    - [\<MemoryRouter\>](#memoryrouter)
        - [initialEntries: array](#initialentries-array)
        - [initialIndex: number](#initialindex-number)
        - [getUserConfirmation: func](#getuserconfirmation-func-2)
        - [keyLength: number](#keylength-number-1)
        - [children: node](#children-node-2)
    - [\<Redirect\>](#redirect)
        - [to: string](#to-string-1)
        - [to: object](#to-object-1)
        - [push: bool](#push-bool)
        - [from: string](#from-string)
        - [exact: bool](#exact-bool-1)
        - [strict: bool](#strict-bool-1)
        - [sensitive: bool](#sensitive-bool)
    - [\<Route\>](#route)
        - [Route render methods](#route-render-methods)
        - [Route props](#route-props)
        - [component](#component)
        - [render: func](#render-func)
        - [children: func](#children-func)
        - [path: string | string[]](#path-string--string)
        - [exact: bool](#exact-bool-2)
        - [strict: bool](#strict-bool-2)
        - [location: object](#location-object-1)
        - [sensitive: bool](#sensitive-bool-1)
    - [\<Router\>](#router)
        - [history: object](#history-object)
        - [children: node](#children-node-3)
    - [\<StaticRouter\>](#staticrouter)
        - [basename: string](#basename-string-2)
        - [location: string](#location-string)
        - [location: object](#location-object-2)
        - [context: object](#context-object)
        - [children: node](#children-node-4)
    - [\<Switch\>](#switch)
        - [location: object](#location-object-3)
        - [children: node](#children-node-5)
    - [history](#history)
        - [history is mutable](#history-is-mutable)
    - [location](#location)
    - [match](#match)
        - [null matches](#null-matches)
    - [matchPath](#matchpath)
        - [pathname](#pathname)
        - [props](#props)
        - [returns](#returns)
    - [withRouter](#withrouter)
        - [Component.WrappedComponent](#componentwrappedcomponent)
        - [wrappedComponentRef: func](#wrappedcomponentref-func)

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

路由组件可能是反应路由器中最重要的组件，了解和学习使用好。它最基本的职责是在路径匹配当前 URL 时呈现某个 UI。

考虑以下代码:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/news">
                <NewsFeed />
            </Route>
        </div>
    </Router>,
    node
);
```

如果应用程序的位置是 `/`，那么 UI 层次结构将如下:

```javascript
<div>
    <Home />
    <!-- react-empty: 2 -->
</div>
```

如果 app 的位置是 `/news`，那么 UI 层次结构为:

```javascript
<div>
    <!-- react-empty: 1 -->
    <NewsFeed />
</div>
```

"react-empty" 注释只是 React null 呈现的实现细节. 但就我们的目的而言，它是有益的。路由在技术上总是“呈现”的，即使它的呈现为空。当 `<Router>` 的路径匹配当前的 URL, 它将渲染它的孩子(你的组件).

如果在组件树的同一点上，同一个组件作为多个 `<Route>` 的子组件使用，React 会将其视为相同的组件实例，并且在路由更改之间，组件的状态将被保留。
如果不需要这样做，添加到每个路由组件的唯一 key 属性将导致在路由更改时响应, 重新创建组件实例。

### Route render methods

推荐的渲染方法是将需要渲染的内容作为一个 `<Route>`的子元素, 如上所述. 但是，`<Route>` 还有一些其他的方法可以用来渲染。它们主要是为支持应用程序而提供的，这些应用程序是在引入钩子之前用早期版本的路由器构建的。

-   `<Route component>`
-   `<Route render>`
-   `<Route children> function`

你应该只使用这些属性的其中一种方法. 看看下面他们的解释，了解他们之间的区别。

### Route props

所有的渲染方法都将传递这三个路由属性.

-   match
-   location
-   history

### component

一个 React 组件, 只在 location 匹配的时候才会被渲染. 它将使用 route props 属性渲染.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

// All route props (match, location and history) are available to User
function User(props) {
    return <h1>Hello {props.match.params.username}!</h1>;
}

ReactDOM.render(
    <Router>
        <Route path="/user/:username" component={User} />
    </Router>,
    node
);
```

当你使用 component 方法(而不是 render 或 children，如上)时, 路由器从给定的组件使用 `React.createElement` 创建新的 React 元素. 这意味着如果您为组件属性提供内联函数，那么您将在每次呈现时创建一个新组件。这将导致现有组件卸载和新组件挂载，而不仅仅是更新现有组件。当使用内联函数进行内联呈现时，请使用 render 或 children (如下)。

### render: func

这样就可以方便地进行内联呈现和包装，而不需要进行上面解释的重新加载。

不用使用 component 属性为您创建一个新的 React 元素，您可以传入一个函数，以便在位置匹配时调用。render 属性功能可以访问所有与组件渲染属性相同的 route props(match, location 和 history)。

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

// convenient inline rendering
ReactDOM.render(
    <Router>
        <Route path="/home" render={() => <div>Home</div>} />
    </Router>,
    node
);

// wrapping/composing
// You can spread routeProps to make them available to your rendered Component
function FadingRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={(routeProps) => (
                <FadeIn>
                    <Component {...routeProps} />
                </FadeIn>
            )}
        />
    );
}

ReactDOM.render(
    <Router>
        <FadingRoute path="/cool" component={Something} />
    </Router>,
    node
);
```

**警告**: `<Route component>` 优先于 `<Route render>`, 所以不要在相同的 `<Route>` 中两者都使用.

### children: func

有时无论 location 是否匹配, 你都需要渲染. 在这些情况下，可以使用 children prop 函数。它的工作方式和 render 完全一样，除了不管匹配与否, 它都会被调用。

children prop 接收所有与 component 和 render 方法相同的 route props，除非路由无法匹配 URL，那么 match 为 null。这允许根据路由是否匹配动态调整 UI。这里，如果路由匹配，我们将添加一个激活的类.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

function ListItemLink({ to, ...rest }) {
    return (
        <Route
            path={to}
            children={({ match }) => (
                <li className={match ? "active" : ""}>
                    <Link to={to} {...rest} />
                </li>
            )}
        />
    );
}

ReactDOM.render(
    <Router>
        <ul>
            <ListItemLink to="/somewhere" />
            <ListItemLink to="/somewhere-else" />
        </ul>
    </Router>,
    node
);
```

这对动画也很有用

```javascript
<Route
    children={({ match, ...rest }) => ({
        /* Animate will always render, so you can use lifecycles
        to animate its child in and out */
    }
    <Animate>
        {match && <Something {...rest}/>}
    </Animate>
    )}
/>
```

**警告**: `<Route children>` 优先于 `<Route component>` 和 `<Route render>`, 所以在同一个 `<Route>` 只需要使用其中一种方法就可以了.

### path: string | string[]

任何有效的 URL 路径或者路径数组, 需要能够被 `path-to-regexp@^1.7.0` 模块识别.

没有路径的路由总是匹配的。

```javascript
<Route path="/users/:id">
    <User />
</Route>
<Route path={["/users/:id", "/profile/:id"]}>
    <User />
</Route>
```

### exact: bool

为 true 时, 路径必须与 location.pathname 完全匹配.

| path | location.pathname | exact | matches\? |
| ---- | ----------------- | ----- | --------- |
| /one | /one/two          | true  | no        |
| /one | /one/two          | false | yes       |

### strict: bool

为 true 时, 末尾带有斜杠的路径只会匹配末尾带有斜杠的 location.pathname. 当 location.pathname 名中有额外的 URL 段时，这将不起作用。

| path  | location.pathname | matches\? |
| ----- | ----------------- | --------- |
| /one/ | /one              | no        |
| /one/ | /one/             | yes       |
| /one/ | /one/two          | yes       |

**警告**: strict 可用于强制路径名末尾没有斜杠，但为了做到这一点，strict 和 exact 都必须为真。

| path | location.pathname | matches\? |
| ---- | ----------------- | --------- |
| /one | /one              | yes       |
| /one | /one/             | no        |
| /one | /one/two          | no        |

### location: object

`<Route>` 元素尝试将其路径与当前历史位置(通常是当前浏览器 URL)匹配。但是，也可以传递具有不同路径名的位置以进行匹配。

常常用于当 `<Route>` 需要匹配一个当前历史位置以外的位置时, 如动画转换示例所示。

如果一个 `<Route>` 元素被 `<Switch>` 包裹, 并且匹配传递给的 `<Switch>` 的位置(或当前历史位置), 那么传递给 `<Route>` 的位置属性将被 `<Switch>` 所使用的覆盖.(这里)

### sensitive: bool

当为 true 时，将匹配是否区分大小写的路径。

| path | location.pathname | sensitive | matches\? |
| ---- | ----------------- | --------- | --------- |
| /one | /one              | true      | yes       |
| /One | /one              | true      | no        |
| /One | /one              | false     | yes       |

## \<Router\>

所有路由器组件的公共低级接口。通常应用程序将使用一个高级路由器代替:

-   `<BrowserRouter>`
-   `<HashRouter>`
-   `<MemoryRouter>`
-   `<NativeRouter>`
-   `<StatisRouter>`

使用低级路由器最常见的用例是将自定义历史与状态管理库(如 Redux 或 Mobx)同步。请注意，在使用状态管理库和 React Router 时并不需要这样做，它只用于深度集成。

### history: object

用于导航的历史记录对象。

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";

const customHistory = createBrowserHistory();

ReactDOM.render(<Router history={customHistory} />, node);
```

### children: node

要呈现的子元素。

## \<StaticRouter\>

从不改变 location 的路由器.

这在服务器端渲染场景中非常有用, 当用户没有实际点击时，以至于 location 对象实际上不会改变。因此，名称为:静态。它也可以用在简单的测试中，当您只需要插入一个位置并对呈现输出进行断言时，它也很有用。

```javascript
import http from "http";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";

http.createServer((req, res) => {
    // This context object contains the results of the render
    const context = {};

    const html = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={context}>
            <App />
        </StaticRouter>
    );

    // context.url will contain the URL to redirect to if a <Redirect> was used
    if (context.url) {
        res.writeHead(302, {
            Location: context.url,
        });
        res.end();
    } else {
        res.write(html);
        res.end();
    }
}).listen(3000);
```

### basename: string

所有位置的基 URL。正确格式化的 basename 应该有一个前导斜杠，但没有结尾斜杠。

```javascript
<StaticRouter basename="/calendar">
    <Link to="/today"/> // renders <a href="/calendar/today">
</StaticRouter>
```

### location: string

服务器接收到的 URL, 一般情况下是 node 服务器的 `req.url`.

```javascript
<StaticRouter location={req.url}>
    <App />
</StaticRouter>
```

### location: object

localion 对象, 类似于 { pathname, search, hash, state }

```javascript
<StaticRouter location={{ pathname: "/bubblegum" }}>
    <App />
</StaticRouter>
```

### context: object

一个普通的 JavaScript 对象。在呈现期间，组件可以向对象添加属性以存储有关呈现的信息。

当一个 `<Route>` 匹配时，它将把 context 对象传递给它呈现为 staticContext 属性的组件。查看服务器呈现指南，了解关于如何自己完成此操作的更多信息。

在呈现之后，这些属性可用于配置服务器的响应。

### children: node

要呈现的子元素。

注意: 在 React 16 版本之前, 必须使用一个子元素，因为呈现方法不能返回多个元素。如果需要多个元素，可以尝试将它们包装在一个额外的 `<div>` 中。

## \<Switch\>

渲染第一个匹配的 `<Route>` 或者 `<Redirect>`.

**这和仅仅使用一堆 `<Route>` 有什么不同?**

`<Switch>` 是惟一的，因为它只呈现一个 `<Route>`。相比之下，每条 `<Route>` 匹配渲染所包含的 location。参考这些 `<Route>`:

```javascript
import { Route } from "react-router";

let routes = (
    <div>
        <Route path="/about">
            <About />
        </Route>
        <Route path="/:user">
            <User />
        </Route>
        <Route>
            <NoMatch />
        </Route>
    </div>
);
```

如果 URL 是/about，则 `<About>`, `<User>` 和 `<NoMatch>` 将全部渲染，因为它们都匹配路径。这是通过设计实现的，它允许我们以多种方式在应用程序中创建路径，比如侧边栏、面包屑、引导标签等等。

然而，有时我们只想选择一条路线来呈现。如果我们在 /about，我们不想匹配 /:user(或显示我们的 “404” 页面)。这里显示 `<Switch>` 是如何工作的:

```javascript
import { Route, Switch } from "react-router";

let routes = (
    <Switch>
        <Route exact path="/">
            <Home />
        </Route>
        <Route path="/about">
            <About />
        </Route>
        <Route path="/:user">
            <User />
        </Route>
        <Route>
            <NoMatch />
        </Route>
    </Switch>
);
```

现在, 如果我们在 /about, `<Switch>` 将开始查询一个匹配的 `<Route>`. `<Route path="/about" />` 将匹配, 并且 `<Switch>` 将停止匹配查询同时呈现 `<Abount>`. 类似的, 如果我们在 /micheal, 那么 `<User>` 将呈现.

这对动画过渡也很有用，因为匹配的路径在与前一个相同的位置呈现。

```javascript
let routes = (
    <Fade>
        <Switch>
            {/* there will only ever be one child here */}
            <Route />
            <Route />
        </Switch>
    </Fade>
);

let routes = (
    <Fade>
        {/* there will always be two children here,
        one might render null though, making transitions
        a bit more cumbersome to work out */}
        <Route />
        <Route />
    </Fade>
);
```

### location: object

一个位置对象，用于匹配子元素，而不是当前历史位置(通常是当前浏览器 URL)。

### children: node

所有 `<Switch>` 的子节点应该为 `<Route>` 或者 `<Redirect>` 元素. 只有第一个匹配当前位置的子节点将被渲染.

`<Route>` 元素使用它们的 path 属性匹配, `<Redirect>` 元素使用它们的 from 属性匹配. 如果 `<Route>` 没有传入 path 属性或者 `<Redirect>` 没有传入 from 属性, 那么它们将永远匹配当前的位置.

当你在 `<Switch>` 中包含 `<Redirect>`, 它能够使用 `<Route>` 的任意位置匹配属性: path, exact, strict. from 属性只是 path 的别名.

如果 `<Switch>` 设置了 location 属性, 它将覆盖匹配子节点的 location 属性.

```javascript
import { Redirect, Route, Switch } from "react-router";

let routes = (
    <Switch>
        <Route exact path="/">
            <Home />
        </Route>

        <Route path="/users">
            <Users />
        </Route>
        <Redirect from="/accounts" to="/users" />

        <Route>
            <NoMatch />
        </Route>
    </Switch>
);
```

## history

这个文档中的术语 "history" 和 "history object" 指的是 [the history package](https://github.com/ReactTraining/history)，它是 React 路由器仅有的两个主要依赖项之一(除了 React 本身之外)，它提供了几种不同的实现，用于在各种环境中用 JavaScript 管理会话历史。

还可以使用以下术语:

-   "browser history" - DOM 特定的实现, 用于 web, 支持 HTML5 的 history API.
-   "hash history" - DOM 特定的实现, 适用于历史遗留的网页浏览器.
-   "memory history" - 一个内存中的模拟实现, 用于测试和非 DOM 环境(像 React Native).

history 对象通常有以下属性和方法:

-   length - (number)历史堆栈中的条目数
-   action - (string)当前的 action(PUSH, REPLACE, or POP)
-   location - (object)当前的位置, 可能有如下属性:
    -   pathname - (string) URL 的路径
    -   search - (string) URL 的查询字符串
    -   hash - (string) URL 的哈希片段
    -   state - (object) localtion 对象特定的状态, 当 location 对象通过 push(path, state) 方法被推送到历史栈时, 会提供 state 对象, 仅在浏览器和内存历史中可用
-   push(path, [state]) - (function)替换历史堆栈上的当前条目
-   replace(path, [state]) - (function)替换历史堆栈上的当前条目
-   go(n) - (function) 在历史堆栈中移动 n 个条目的指针
-   goBack() - (function) 等效于 go(-1)
-   goForward() - (function) 等效于 go(1)
-   block(prompt) - (function) 防止导航(参考[the history docs](https://github.com/ReactTraining/history/blob/master/docs/Blocking.md)

### history is mutable

历史对象是可变的。因此，建议从 `<Route>` 的渲染属性中访问位置，而不是从 history.location。这确保了在生命周期钩子中关于 React 的假设是正确的。例如:

```javascript
class Comp extends React.Component {
    componentDidUpdate(prevProps) {
        // will be true
        const locationChanged = this.props.location !== prevProps.location;

        // INCORRECT, will *always* be false because history is mutable.
        const locationChanged = this.props.history.location !== prevProps.history.location;
    }
}

<Route component={Comp} />;
```

根据您正在使用的实现，还可能出现其他属性。请参考[历史文档](https://github.com/ReactTraining/history/tree/master/docs)以了解更多细节。

## location

位置表示应用程序现在的位置，你想让它去哪里，甚至是它曾经在哪里。它看起来像这样:

```javascript
{
    key: 'ac3df4', // not with HashHistory!
    pathname: '/somewhere',
    search: '?some=search-string',
    hash: '#howdy',
    state: {
        [userDefined]: true
    }
}
```

路由器会在几个地方为你提供一个位置对象:

-   Route component 像 `this.props.location`
-   Route render 像 `({ location }) => ()`
-   Route children 像 `({ location }) => ()`
-   withRouter 像 `this.props.location`

它也出现在 history.location 上, 但是你不应该使用, 因为它是可变的. 你可以阅读更多关于 [history](https://reacttraining.com/react-router/web/api/history) 的内容.

location 对象永远不会发生变化，所以可以在生命周期钩子中使用它来确定导航何时发生，这对于数据获取和动画非常有用。

```javascript
componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
        // navigated!
    }
}
```

您可以提供 location 对象，而不是字符串用于导航的各个地方:

-   Web [Link to](https://reacttraining.com/react-router/web/api/Link/to)
-   Native [Link to](https://reacttraining.com/react-router/native/api/Link/to)
-   [Redirect to](https://reacttraining.com/react-router/web/api/Redirect/to)
-   [history.push](https://reacttraining.com/react-router/web/api/history/push)
-   [history.replace](https://reacttraining.com/react-router/web/api/history/push)

通常你只使用一个字符串，但如果你需要添加一些“位置状态”，当应用程序返回到那个特定位置时，你可以使用一个位置对象。如果您想根据导航历史而不是路径(比如模态)对 UI 进行分支，这是非常有用的。

```javascript
// usually all you need
<Link to="/somewhere"/>

// but you can use a location instead
const location = {
  pathname: '/somewhere',
  state: { fromDashboard: true }
}

<Link to={location}/>
<Redirect to={location}/>
history.push(location)
history.replace(location)
```

最后，您可以将 location 对象传递给以下组件:

-   Route
-   Switch

这将阻止他们使用实际位置在路由器的状态。这对于动画和挂起导航非常有用，或者当您想让组件在与实际不同的位置呈现时也非常有用。

## match

匹配对象包含了 `<Route path>` 与 URL 匹配的信息, match 对象包含以下属性:

-   params - (object) 对应于路径的动态段的 URL 解析的键/值对
-   isExact - (boolean) 如果整个 URL 已匹配(没有尾随字符)，则为真
-   path - (string) 用于匹配的路径模式。用于构建嵌套的 `<Route>`
-   url - (string) URL 的匹配部分。对于构建嵌套链接非常有用

你可以在不同的地方匹配对象:

-   Route component 像 `this.props.match`
-   Route render 像 `({ match }) => ()`
-   Route children 像 `({match}) => ()`
-   withRouter 像 `this.props.match`
-   matchPath 作为返回值
-   useRouteMatch 作为返回值

如果 `<Route>` 没有 path 参数, 那么将总是匹配, 你讲获得父组件节点的 match 对象. withRouter 也是一样.

### null matches

`<Route>` 使用 children 属性将调用它的 children 函数，即使路由的路径与当前位置不匹配。在这种情况下，match 对象将是 null。能够在路径匹配时渲染路径的内容是很有用的，但是这种情况会带来一些挑战。

默认的 "解析" url 的方法是把 match.url 字符串添加到 "相对" 路径.

```javascript
let path = `${match.url}/relative-path`;
```

如果在匹配为 null 时尝试这样做，将以类型错误告终。这意味着在使用 children 属性时，尝试连接路由中的“相对”路径是不安全的。

当在生成空匹配对象的路由中使用无路径路由时，会出现类似但更微妙的情况。

```javascript
// location.pathname = '/matches'
<Route path="/does-not-match"
  children={({ match }) => (
    // match === null
    <Route
        render={({ match: pathlessMatch }) => (
            // pathlessMatch === ???
        )}
    />
  )}
/>
```

无路径路由从父路由继承匹配对象。如果它们的父匹配项是 null，那么它们的匹配项也是 null。这意味着:

-   a)任何子路由/链接都必须是绝对的，因为没有父路由可以解析;
-   b)父匹配可以为 null 的无路径路由将需要使用 children 属性。

## matchPath

这使您可以使用 `<Route>` 在正常呈现周期之外使用的相同匹配代码，比如在服务器上呈现之前收集数据依赖项。

```javascript
import { matchPath } from "react-router";

const match = matchPath("/users/123", {
    path: "/users/:id",
    exact: true,
    strict: false,
});
```

### pathname

第一个参数是要匹配的路径名。如果您在服务器上使用 Node.js，应该是 req.path。

### props

第二个参数是要匹配的属性，它们与 `<Route>` 所接受的匹配属性相同。它也可以是字符串或字符串数组作为 `{ path }` 的快捷方式:

```javascript
{
    path, // like /users/:id; either a single string or an array of strings
    strict, // optional, defaults to false
    exact, // optional, defaults to false
}
```

### returns

当前 pathname 与路径属性匹配时, 返回一个对象.

```javascript
matchPath("/users/2", {
    path: "/users/:id",
    exact: true,
    strict: true,
});

//  {
//    isExact: true
//    params: {
//        id: "2"
//    }
//    path: "/users/:id"
//    url: "/users/2"
//  }
```

当 pathname 与路径属性不匹配时, 返回 null

```javascript
matchPath("/users", {
    path: "/users/:id",
    exact: true,
    strict: true,
});

//  null
```

## withRouter

您可以通过 withRouter 高阶组件访问历史对象的属性和最近路由的匹配。当被包装的组件呈现时，withRouter 会将更新的 match, position 和 history 属性传递给它。

```javascript
import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

// A simple component that shows the pathname of the current location
class ShowTheLocation extends React.Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    render() {
        const { match, location, history } = this.props;

        return <div>You are now at {location.pathname}</div>;
    }
}

// Create a new component that is "connected" (to borrow redux
// terminology) to the router.
const ShowTheLocationWithRouter = withRouter(ShowTheLocation);
```

重要提示

withRouter 不会像 React Redux 的 connect 订阅状态更改那样订阅位置更改。相反，在位置变化从路由器组件传播出去后重新呈现。这意味着 withRouter 不会在路由转换上重新渲染，除非它的父组件重新渲染。

静态方法和属性

包装组件的所有非响应特定静态方法和属性将自动复制到 "连接的" 组件。

### Component.WrappedComponent

被包装的组件公开为返回组件上的静态属性 WrappedComponent，它可用于隔离地测试组件。

```javascript
// MyComponent.js
export default withRouter(MyComponent)

// MyComponent.test.js
import MyComponent from './MyComponent'
render(<MyComponent.WrappedComponent location={{...}} ... />)
```

### wrappedComponentRef: func

将作为 ref 属性传递给包装组件的函数。

```javascript
class Container extends React.Component {
    componentDidMount() {
        this.component.doSomething();
    }

    render() {
        return <MyComponent wrappedComponentRef={(c) => (this.component = c)} />;
    }
}
```
