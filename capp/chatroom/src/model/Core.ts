/**
 * 数据核心
 * @author dodo
 * @date 2020.05.09
 */

import ChatRoom from "./ChatRoom";
import Dev from "../utils/Dev";
import url from "url";
import Consts from "../const/Consts";

export class Core {
    public static getInstance(): Core {
        if (this.s_instance === undefined) {
            this.s_instance = new Core();
        }
        return this.s_instance;
    }

    private constructor() {
        const urlObj = url.parse(window.location.href, true);

        // 主机
        if (urlObj.query["host"]) {
            Consts.SOCKET_IO_HOST = urlObj.query["host"] as string;
            Dev.print("Core", `host is ${Consts.SOCKET_IO_HOST}`);
        }

        // 用户名/密码
        if (urlObj.query["name"] && urlObj.query["password"]) {
            this.m_defaultName = urlObj.query["name"] as string;
            this.m_defaultPassword = urlObj.query["password"] as string;
            Dev.print("Core", `name = ${this.m_defaultName}, password = ${this.m_defaultPassword}`);
        }

        this.m_room = new ChatRoom();
    }

    public get defaultRoom() {
        return this.m_room;
    }

    public get defaultName() {
        return this.m_defaultName;
    }

    public get defaultPassword() {
        return this.m_defaultPassword;
    }

    private static s_instance: Core | undefined;
    private m_room: ChatRoom;
    private m_defaultName: string | undefined;
    private m_defaultPassword: string | undefined;
}

const core = Core.getInstance();
export default core;
