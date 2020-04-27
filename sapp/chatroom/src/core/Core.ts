/**
 * 核心功能
 * @author dodo
 * @date 2020.04.27
 */

import { EventEmitter } from "events";
import ChatRoom from "./ChatRoom";

export class Core extends EventEmitter {
    /**
     * 单例
     */
    public static getInstance(): Core {
        if (this.instance === undefined) {
            this.instance = new Core();
        }
        return this.instance;
    }

    private constructor() {
        super();
        Core.instance = this;

        this.m_chatRoom = new ChatRoom();
    }

    /**
     * 初始化
     */
    public init(): void {
        this.m_chatRoom.run();
    }

    private static instance: Core;
    private m_chatRoom: ChatRoom;
}

const core = Core.getInstance();
export default core;
