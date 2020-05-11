/**
 * App 数据组织
 * @author dodo
 * @date 2020.05.11
 */

import { IChatRoom, IChatUser } from "./ProtocolTypes";

export class Store {
    public static getInstance(): Store {
        if (this.s_instance === undefined) {
            this.s_instance = new Store();
        }
        return this.s_instance;
    }

    private constructor() {}

    private static s_instance?: Store;
    public charRoom?: IChatRoom;
    public myself?: IChatUser;
}

const store = Store.getInstance();
export default store;
