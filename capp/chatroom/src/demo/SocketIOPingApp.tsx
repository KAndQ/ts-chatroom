import React, { Component } from "react";
import "../App.css";
import SocketIO from "socket.io-client";
import * as binconv from 'binconv';

interface IState {
    count: number;
}

export default class App extends Component<any, IState> {
    public constructor(props: any) {
        super(props);

        this.state = {
            count: 0,
        };
    }

    componentDidMount() {
        const socket = SocketIO("http://127.0.0.1:48081/")
            .on("connect", () => {
                console.log("[SOCKETIO CONNECT]");

                setInterval(() => {
                    socket.emit("message", "ping");
                    this.setState({ count: this.state.count + 1 });
                }, 1000);
                socket.emit("message", "ping");
                this.setState({ count: this.state.count + 1 });
            })
            .on("message", (data: any) => {
                if (data instanceof String) {
                    console.log("[SOCKETIO STRING DATA]: " + data);
                } else if (data instanceof ArrayBuffer) {
                    console.log("[SOCKETIO ARRAYBUFFER DATA]: " + binconv.uint8ArrayToString(new Uint8Array(data)));
                }
            });
    }

    render() {
        return (
            <div className="App">
                <h1>PingApp Demo</h1>
                count = {this.state.count}
            </div>
        );
    }
}
