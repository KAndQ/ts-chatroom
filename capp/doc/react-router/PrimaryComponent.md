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

## BrowserRouter
