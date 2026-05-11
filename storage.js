"use strict";

import sqlite3 from "sqlite3";
import Utilities from './utilities.js';
import { SERVER_DATABASE } from "./configuration.js";

var db = new sqlite3.Database(SERVER_DATABASE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

class Table {
    constructor(name, columns) {
        this.name = name;
        this.columns = columns;
    }
}

const fetchAll = async (db, sql, params) => {
    return new Promise(
        (resolve, reject) => {
            db.all(
                sql, 
                params, 
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        }
    );
};

const fetchFirst = async (db, sql, params) => {
    return new Promise(
        (resolve, reject) => {
            db.get(
                sql, 
                params,
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        }
    );
};

class Storage {
    constructor() {
        // Initialization code
    }

    /*
    [Symbol.dispose]() {
        console.log("Closing database connection.")
        db.close();
    }
    */

    getAllSessions() {
        return db.run("select session_id from sessions")
    }

    async sessionExists(sessionId) { 
        const row = await fetchFirst(db, "select session_id from sessions where session_id = ?", [sessionId]);
        return row !== undefined && row !== null;
    }

    deleteSession(sessionId) {
        db.run("delete from sessions where session_id = ?", [sessionId])
    }

    saveSession(sessionId) {
        db.run("insert into sessions (session_id) values (?)", [sessionId])
        return true
    }

    async getLastRoll(sessionId) {
        const retValue = await fetchFirst(db, "select player, roll_value, timestamp from rolls where session_id = ? order by timestamp desc limit 1", [sessionId])
        if (retValue == undefined || retValue == null) {
            retValue = 6;
        }
        return retValue
    }

    static async createTables() {
        var row = undefined;
        var sql = "";
        var tables = [];

        tables.push(new Table("sessions", ["session_id text"]));
        tables.push(new Table("rolls", ["session_id text", "player text", "roll_value integer", "timestamp datetime"]));

        for (const table of tables) {
            sql = "select name from sqlite_master where type='table' and name='" + table.name + "'";
            row = await fetchFirst(db, sql, []);
            
            if (row !== undefined && row !== null) {
                console.log("Table " + table.name + " already exists.")
                console.log("Dropping table " + table.name + ".")
                db.exec("drop table " + table.name);
            }

            sql = "create table " + table.name + " (" + table.columns.join(", ") + ")";
            db.exec(
                sql, 
                (err) => {
                    if (err) {
                        console.log("Unable to create table " + table.name + ": " + err)
                    } else {
                        console.log("Created table " + table.name + ".")
                    }
                }
            ); 
        }
        
        db.close();
        db = new sqlite3.Database(SERVER_DATABASE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
        return true
    }
};

export { db };
export default Storage;