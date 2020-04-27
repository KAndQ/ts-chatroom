/**
 * 聊天室的用户
 * @author dodo
 * @date 2020.04.27
 */

export default class ChatUser {
    public constructor() {
        this.m_uid = 0;
        this.m_nickname = "";
        this.m_password = "";
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

    private m_uid: number;
    private m_nickname: string;
    private m_password: string;
}
