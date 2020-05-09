/**
 * 数据库操作相关
 * @author dodo
 * @date 2020.05.08
 */

import sqlite3 from "sqlite3";
import Dev from "../utils/Dev";
import DBUser from "./DBUser";
import DBMessage from "./DBMessage";

const DB_FILE = "db.sqlite";
const TAG = "DataBase";

export class DataBase {
    /**
     * 获得 DataBase 单例实例
     */
    public static getInstance(): DataBase {
        if (this.instance === undefined) {
            this.instance = new DataBase();
        }
        return this.instance;
    }

    private constructor() {}

    public get db(): sqlite3.Database | undefined {
        return this.m_db;
    }

    /**
     * 初始化
     */
    public init(): void {
        if (this.m_isInit) {
            return;
        }

        this.m_isInit = true;

        Dev.print(TAG, "==>> init");
        sqlite3.verbose();
        this.m_db = new sqlite3.Database(DB_FILE);

        this.m_db.on("open", () => {
            Dev.print(TAG, "==>> open");

            DBUser.init(this).then(async () => {
                Dev.print(TAG, "DBUser success");

                const chatUser = await DBUser.login(this, "robot2", "123456");
                console.log(chatUser);
            });
            DBMessage.init(this).then(() => {
                Dev.print(TAG, "DBMessage success");
            });
        });
        this.m_db.on("close", () => {
            Dev.print(TAG, "==>> close");
        });
        this.m_db.on("trace", (sql) => {
            Dev.print(TAG, "==>> sql =", sql);
        });
        this.m_db.on("profile", (sql, time) => {
            Dev.print(TAG, `==>> profile sql = ${sql}, time = ${time}ms`);
        });
        this.m_db.on("error", (err) => {
            Dev.print(TAG, "==>> error", err.message);
        });
    }

    private static instance: DataBase | undefined;
    private m_db: sqlite3.Database | undefined;
    private m_isInit: boolean = false;
}

const db = DataBase.getInstance();
export default db;
