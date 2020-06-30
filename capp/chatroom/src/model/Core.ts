/**
 * 数据核心
 * @author dodo
 * @date 2020.05.09
 */

import Dev from "../utils/Dev";
import url from "url";
import Consts from "../const/Consts";
import { EventEmitter } from "events";
import NetClient from "../net/NetClient";
import { Store } from "../model/Store";
import store from "./Store";
import ChatUserCache from "./ChatUserCache";

export class Core extends EventEmitter {
    public static getInstance(): Core {
        if (this.s_instance === undefined) {
            this.s_instance = new Core();
        }
        return this.s_instance;
    }

    private constructor() {
        super();

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

        // build path
        if (urlObj.path && urlObj.path.indexOf("build/")) {
            Dev.print("Core", urlObj.path);
            this.m_isBuildPath = true;
        }

        this.m_client = new NetClient();
        this.m_store = store;
        this.m_chatUserCache = new ChatUserCache();
    }

    public get defaultName() {
        return this.m_defaultName;
    }

    public get defaultPassword() {
        return this.m_defaultPassword;
    }

    public get client() {
        return this.m_client;
    }

    public get store(): Store {
        return this.m_store;
    }

    public get chatUserCache(): ChatUserCache {
        return this.m_chatUserCache;
    }

    public get isBuildPath(): boolean {
        return this.m_isBuildPath;
    }

    private static s_instance?: Core;
    private m_defaultName?: string;
    private m_defaultPassword?: string;
    private m_client: NetClient;
    private m_store: Store;
    private m_chatUserCache: ChatUserCache;
    private m_isBuildPath: boolean = false;
}

const core = Core.getInstance();
export default core;
