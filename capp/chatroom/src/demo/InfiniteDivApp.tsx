import React, { Component } from "react";
import "../App.css";
import { Button } from "antd";

export default class InfiniteDivApp extends Component {
    render() {
        const divs = [];
        for (let i = 0; i < 100; ++i) {
            divs.push(<div key={i.toString()}>{i.toString()}</div>);
        }
        return (
            <div
                style={{
                    width: "100%",
                    height: 400,
                    backgroundColor: "#ffff00",
                    display: "flex",
                    flexDirection: "column",
                }}>
                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "column",
                        backgroundColor: "#00ffff",
                        overflowY: "auto",
                    }}
                    ref={(elem) => {
                        this.m_divElem = elem;
                    }}>
                    {divs}
                </div>
                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "row",
                        backgroundColor: "#0044ff",
                    }}>
                    <Button
                        onClick={() => {
                            this.scrollToEnd();
                        }}>
                        滚到最下
                    </Button>
                </div>
            </div>
        );
    }

    private scrollToEnd() {
        if (this.m_divElem) {
            const scrollHeight = this.m_divElem.scrollHeight; //里面div的实际高度  2000px
            const height = this.m_divElem.clientHeight; //网页可见高度  200px
            const maxScrollTop = scrollHeight - height;
            this.m_divElem.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
            //如果实际高度大于可见高度，说明是有滚动条的，则直接把网页被卷去的高度设置为两个div的高度差，实际效果就是滚动到底部了。
        }
    }

    private m_divElem: any;
}
