/**
 * 房间网络相关处理
 * @author dodo
 * @date 2020.05.11
 */

import { ResponseGetRoomInfo } from "../model/ProtocolTypes";
import core from "../model/Core";
import { EVENT_UPDATE_ONLINE_USERS, EVENT_UPDATE_ROOM_INFO } from "../model/Events";

export default class NetRoom {
    /**
     * 查询房间信息
     */
    public static async getRoomInfo() {
        core.client.request("getRoomInfo", {}, (resp: ResponseGetRoomInfo) => {
            core.store.chatRoom = resp.room;
            core.emit(EVENT_UPDATE_ROOM_INFO);
            core.emit(EVENT_UPDATE_ONLINE_USERS);
        });
    }
}
