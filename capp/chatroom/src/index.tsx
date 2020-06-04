import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import RouterApp from "./demo/RouterApp";
// import SocketIOApp from "./demo/SocketIOPingApp";
// import WebSocketApp from "./demo/WebSocketPingApp";
// import NetClientApp from "./demo/NetClientApp";
// import InfiniteDivApp from "./demo/InfiniteDivApp";
// import ReactScrollApp from "./demo/ReactScrollApp";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
    // <React.StrictMode>
    // <App />,
    <RouterApp />,
    // <NetClientApp />,
    // <SocketIOApp />,
    // <WebSocketApp />,
    // <InfiniteDivApp />,
    // <ReactScrollApp />,
    // </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
