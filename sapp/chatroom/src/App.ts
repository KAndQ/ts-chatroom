/**
 * 程序入口
 * @author dodo
 * @date 2020.04.27
 */

import socketEntry from "./socket/Entry";
import core from "./core/Core";

export default class App {
    public run(): void {
        console.log("Run! Fast Run! Gump!");

        core.init();
        socketEntry.run();
    }
}

const app = new App();
app.run();
