/**
 * 聊天室的用户
 * @author dodo
 * @date 2020.04.27
 */

import { IChatUser } from "./ProtocolTypes";

export default class ChatUser implements IChatUser {
    public constructor() {
        this.m_uid = 0;
        this.m_nickname = "";
        this.m_password = "";
        this.m_loginTime = 0;
        this.m_logoutTime = 0;
    }

    public get uid() {
        return this.m_uid;
    }

    public set uid(value) {
        this.m_uid = value;
    }

    public get nickname() {
        return this.m_nickname;
    }

    public set nickname(value) {
        this.m_nickname = value;
    }

    public get password() {
        return this.m_password;
    }

    public set password(value) {
        this.m_password = value;
    }

    public get loginTime() {
        return this.m_loginTime;
    }

    public set loginTime(value) {
        this.m_loginTime = value;
    }

    public get logoutTime() {
        return this.m_logoutTime;
    }

    public set logoutTime(value) {
        this.m_logoutTime = value;
    }

    public toData(): IChatUser {
        return {
            uid: this.m_uid,
            nickname: this.m_nickname,
            password: this.m_password,
            loginTime: this.m_loginTime,
            logoutTime: this.m_logoutTime,
        };
    }

    private m_uid: number;
    private m_nickname: string;
    private m_password: string;
    private m_loginTime: number;
    private m_logoutTime: number;
}
