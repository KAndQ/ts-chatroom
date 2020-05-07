import React, { Component } from "react";
import Button from "antd/es/button";
import "../App.css";
import * as binconv from "binconv";

class App extends Component {
    componentDidMount() {
        const ws = new WebSocket("ws://127.0.0.1:48083/");
        ws.onopen = (ev: Event) => {
            console.log("==>> ws open");
            this.m_ws = ws;
        };
        ws.onmessage = (ev: MessageEvent) => {
            ev.data.arrayBuffer().then((data: ArrayBuffer) => {
                console.log(
                    "[WEBSOCKET DATA]: " + binconv.uint8ArrayToString(new Uint8Array(data))
                );
            });
        };
        ws.onclose = (ev: CloseEvent) => {
            console.log("==>> ws close", ev);
        };
    }

    render() {
        return (
            <div className="App">
                <h1>WebSocket</h1>
                <Button
                    type="primary"
                    onClick={() => {
                        const ws = this.m_ws;
                        if (ws) {
                            ws.send("ping");
                        }
                    }}>
                    start
                </Button>
            </div>
        );
    }

    private m_ws: WebSocket | undefined;
}

export default App;
