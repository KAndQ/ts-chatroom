/**
 * 程序入口
 * @author dodo
 * @date 2020.04.27
 */

import socketEntry from "./socket/Entry";
import socketIOEntry from "./socketio/Entry";
import webSocketEntry from "./websocket/Entry";
import core from "./core/Core";
import Dev from "./utils/Dev";
import db from "./db/DataBase";

export default class App {
    public run(): void {
        Dev.print("App", "Run! Fast Run! Gump!");
        core.init();
        socketEntry.run();
        socketIOEntry.run();
        webSocketEntry.run();
        db.init();
    }
}

const app = new App();
app.run();
