/**
 * 程序入口
 * @author dodo
 * @date 2020.04.27
 */

import socketEntry from "./socket/Entry";
import socketIOEntry from "./socketio/Entry";
import core from "./core/Core";
import Dev from "./utils/Dev";

export default class App {
    public run(): void {
        Dev.print("App", "Run! Fast Run! Gump!");
        core.init();
        socketEntry.run();
        socketIOEntry.run();
    }
}

const app = new App();
app.run();
