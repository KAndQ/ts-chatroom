/**
 * 数据库 User
 *
 * User
 * ----
 * uid | integer 用户 id 自增长
 * name | string 昵称
 * password | string 密码
 * loginTime | integer 登录时间, 时间戳, 单位秒
 * logoutTime | integer 登出时间, 时间戳, 单位秒
 * @author dodo
 * @date 2020.05.08
 */

import { DataBase } from "./DataBase";
import { DB_TABLE_USER } from "../const/Consts";
import Dev from "../utils/Dev";
import ChatUser from "../core/ChatUser";
import StringUtils from "../utils/StringUtils";

export default class DBUser {
    /**
     * 初始化
     */
    public static async init(db: DataBase) {
        return new Promise(async (resolve, reject) => {
            const sql = `select * from sqlite_master where type = 'table' and name = '${DB_TABLE_USER}'`;
            if (db.db) {
                db.db.get(sql, (err: Error | null, row) => {
                    if (err) {
                        Dev.print("DBUser init Error", err.message);
                        reject(err);
                        return;
                    }

                    if (!row) {
                        const createSql =
                            `CREATE TABLE ${DB_TABLE_USER} (\n` +
                            "uid\tINTEGER\tPRIMARY KEY\tAUTOINCREMENT,\n" +
                            "name\tVARCHAR(255)\tUNIQUE\tNOT NULL,\n" +
                            "password\tVARCHAR(255)\tNOT NULL,\n" +
                            "loginTime\tINTEGER\tNOT NULL,\n" +
                            "logoutTime\tINTEGER\tNOT NULL\n" +
                            ");";
                        if (db.db) {
                            db.db.run(createSql, (err) => {
                                if (err) {
                                    Dev.print("DBUser create error", err.message);
                                    reject(err);
                                    return;
                                } else {
                                    resolve();
                                }
                            });
                        }
                    } else {
                        resolve();
                    }
                });
            } else {
                reject(new Error("no sqlite db"));
            }
        });
    }

    /**
     * 删表
     */
    public static async drop(db: DataBase) {
        const sql = `DROP TABLE ${DB_TABLE_USER};`;
        return new Promise((resolve, reject) => {
            if (db.db) {
                db.db.run(sql, (err) => {
                    if (err) {
                        Dev.print("DBUser drop error", err.message);
                        reject(err);
                        return;
                    }
                    resolve();
                });
            } else {
                reject(new Error("no sqlite db"));
            }
        });
    }

    /**
     * 判断用户是否存在
     */
    public static async exist(db: DataBase, name: string): Promise<boolean> {
        name = StringUtils.checkName(name);
        return new Promise((resolve, reject) => {
            if (db.db) {
                db.db.get(`select * from '${DB_TABLE_USER}' where name = '${name}'`, (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (row) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }
                });
            } else {
                reject(new Error("no sqlite db"));
            }
        });
    }

    /**
     * 添加
     */
    public static async add(db: DataBase, name: string, password: string): Promise<ChatUser> {
        name = StringUtils.checkName(name);
        password = StringUtils.checkPassword(password);
        return new Promise((resolve, reject) => {
            if (db.db) {
                const sqlitedb = db.db;
                const loginTime = Math.floor(Date.now() / 1000);
                const logoutTime = 0;
                sqlitedb.run(
                    `INSERT INTO ${DB_TABLE_USER} (name, password, loginTime, logoutTime) VALUES ('${name}', '${password}', ${loginTime}, ${logoutTime});`,
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            sqlitedb.get(
                                `SELECT * FROM ${DB_TABLE_USER} WHERE name = '${name}';`,
                                (err, row) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        if (!row) {
                                            reject(new Error("Not found ChatUser name = " + name));
                                        } else {
                                            const chatUser = new ChatUser();
                                            chatUser.uid = row.uid;
                                            chatUser.nickname = row.name;
                                            chatUser.password = row.password;
                                            chatUser.loginTime = row.loginTime;
                                            chatUser.logoutTime = row.logoutTime;
                                            resolve(chatUser);
                                        }
                                    }
                                }
                            );
                        }
                    }
                );
            } else {
                reject(new Error("no sqlite db"));
            }
        });
    }

    /**
     * 获得 ChatUser
     */
    public static async get(db: DataBase, name: string, password: string): Promise<ChatUser> {
        name = StringUtils.checkName(name);
        password = StringUtils.checkPassword(password);
        return new Promise((resolve, reject) => {
            if (db.db) {
                db.db.get(
                    `select * from '${DB_TABLE_USER}' where name = '${name}' and password = '${password}'`,
                    (err, row) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (row) {
                                const chatUser = new ChatUser();
                                chatUser.uid = row.uid;
                                chatUser.nickname = row.name;
                                chatUser.password = row.password;
                                chatUser.loginTime = row.loginTime;
                                chatUser.logoutTime = row.logoutTime;
                                resolve(chatUser);
                            } else {
                                reject(
                                    new Error(
                                        `Not found chat user name = ${name} password = ${password}`
                                    )
                                );
                            }
                        }
                    }
                );
            } else {
                reject(new Error("no sqlite db"));
            }
        });
    }

    public static async getWithUid(db: DataBase, uid: number): Promise<ChatUser | undefined> {
        return new Promise((resolve, reject) => {
            if (db.db) {
                db.db.get(`SELECT * FROM ${DB_TABLE_USER} WHERE uid = ${uid}`, (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (row) {
                            const chatUser = new ChatUser();
                            chatUser.uid = row.uid;
                            chatUser.nickname = row.name;
                            chatUser.password = row.password;
                            chatUser.loginTime = row.loginTime;
                            chatUser.logoutTime = row.logoutTime;
                            resolve(chatUser);
                        } else {
                            resolve();
                        }
                    }
                });
            } else {
                reject(new Error("No sqlite db"));
            }
        });
    }

    /**
     * 登录/注册
     */
    public static async login(db: DataBase, name: string, password: string): Promise<ChatUser> {
        if (!(await this.exist(db, name))) {
            return this.add(db, name, password);
        } else {
            const chatUser = await this.get(db, name, password);
            chatUser.loginTime = Math.floor(Date.now() / 1000);
            return new Promise((resolve, reject) => {
                if (db.db) {
                    const uid = chatUser.uid;
                    const loginTime = chatUser.loginTime;
                    db.db.run(
                        `UPDATE ${DB_TABLE_USER} SET loginTime = ${loginTime} WHERE uid = ${uid};`,
                        (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(chatUser);
                            }
                        }
                    );
                }
            });
        }
    }

    /**
     * 登出/下线
     */
    public static async logout(db: DataBase, chatUser: ChatUser): Promise<void> {
        chatUser.logoutTime = Math.floor(Date.now() / 1000);
        const { uid, logoutTime } = chatUser;

        return new Promise((resolve, reject) => {
            if (db.db) {
                db.db.run(
                    `UPDATE ${DB_TABLE_USER} SET logoutTime = ${logoutTime} WHERE uid = ${uid};`,
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }
                );
            }
        });
    }
}
