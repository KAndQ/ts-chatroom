/**
 * 数据库 User
 * User
 * ----
 * uid: integer 用户 id 自增长
 * name: string 昵称
 * password: string 密码
 * loginTime: integer 登录时间, 时间戳, 单位秒
 * logoutTime: integer 登出时间, 时间戳, 单位秒
 * @author dodo
 * @date 2020.05.08
 */

import db, { DataBase } from "./DataBase";
import { DB_TABLE_USER } from "../const/Consts";
import Dev from "../utils/Dev";

export default class DBUser {
    /**
     * 初始化
     */
    public static async init(db: DataBase) {
        return new Promise((resolve, reject) => {
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
                            "name\tVARCHAR(255)\tNOT NULL,\n" +
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
    public static async drop() {
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
}
