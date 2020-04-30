import React, { Component } from "react";
import Button from "antd/es/button";
import "./App.css";
import SocketIO from "socket.io-client";

class App extends Component {
    render() {
        return (
            <div className="App">
                <Button type="primary" onClick={() => {
                    console.log("click");

                    let socket = SocketIO("http://127.0.0.1:48081")
                        .on("connect", () => {
                            console.log("[SOCKETIO CONNECT]");
                            socket.emit("data", "ping");
                        })
                        .on("data", (data: any) => {
                            console.log("[SOCKETIO DATA]: " + data);
                        });
                }}>
                    Button
                </Button>
            </div>
        );
    }
}

export default App;
