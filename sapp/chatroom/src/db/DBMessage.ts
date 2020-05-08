/**
 * 数据库 Message
 *
 * Message
 * ----
 * mid | bigint 消息 id
 * mtype | integer 消息类型
 * mcontent | text 消息内容, json 字符串的形式
 * msendTimestamp | integer 发送时间戳, 单位秒
 * fromUid | integer 发送者的 id
 * @author dodo
 * @date 2020.05.08
 */

import { DataBase } from "./DataBase";
import Dev from "../utils/Dev";
import { DB_TABLE_MESSAGE } from "../const/Consts";

export default class DBMessage {
    /**
     * 初始化
     */
    public static async init(db: DataBase) {
        return new Promise((resolve, reject) => {
            const sql = `select * from sqlite_master where type = 'table' and name = '${DB_TABLE_MESSAGE}'`;
            if (db.db) {
                db.db.get(sql, (err, row) => {
                    if (err) {
                        Dev.print("DBMessage init error", err.message);
                        reject(err);
                        return;
                    }

                    if (!row) {
                        const createSql =
                            `CREATE TABLE ${DB_TABLE_MESSAGE} (\n` +
                            "mid\tINTEGER\tPRIMARY KEY\tAUTOINCREMENT,\n" +
                            "mtype\tINTEGER\tNOT NULL,\n" +
                            "mcontent\tTEXT\tNOT NULL,\n" +
                            "msendTimestamp\tINTEGER\tNOT NULL,\n" +
                            "fromUid\tINTEGER\tNOT NULL" +
                            ");";
                        if (db.db) {
                            db.db.run(createSql, (err) => {
                                if (err) {
                                    Dev.print("DBMessage create error", err.message);
                                    reject(err);
                                    return;
                                } else {
                                    resolve();
                                }
                            });
                        } else {
                            reject(new Error("no sqlite db"));
                            return;
                        }
                    } else {
                        resolve();
                    }
                });
            }
        });
    }

    /**
     * 删表
     */
    public static async drop(db: DataBase) {
        return new Promise((resolve, reject) => {
            if (db.db) {
                db.db.run(`DROP TABLE ${DB_TABLE_MESSAGE};`, (err) => {
                    if (err) {
                        Dev.print("DBMessage drop error", err.message);
                        reject(err);
                        return;
                    } else {
                        resolve();
                    }
                });
            } else {
                reject(new Error("no sqlite db"));
            }
        });
    }
}
