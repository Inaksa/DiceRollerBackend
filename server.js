import sqlite3 from "sqlite3";
import Storage from "./storage.js";
import ResponseBuilder from './managers/services/responsebuilder.js';
import Utilities from './utilities.js';
import API from './API.js';
import { createServer } from 'node:http'
import { db } from "./storage.js";
import { SERVER_PORT } from "./configuration.js";
import Errors from "./managers/services/errors.js";
import res from "express/lib/response.js";

const servidor = createServer(async (pedido, respuesta) => {
    if (!db.open) {
        return
    }
    const endpoint = Utilities.convertURL(pedido);

    let result = null;

    if (!endpoint) {
        result = Errors.InvalidEndpoint()
        respuesta.writeHead(result.status)
        respuesta.write(ResponseBuilder.Build(result))
        return
    }

    if (!API.canBeHandled(pedido)) {
        result = Errors.InvalidEndpoint()
        respuesta.writeHead(result.status)
        respuesta.write(ResponseBuilder.Build(result))
        return
    }

    switch (endpoint.path) {
        case "register":
            if (endpoint.session) {
                const sessionId = endpoint.session
                console.log("Wants to register session '" + sessionId + "'.")
                const storage = new Storage()
                try {
                    const hasSession = await storage.sessionExists(sessionId);
                    console.log("Session '" + sessionId + "' exists: " + hasSession)
                    if (!hasSession) {
                        storage.saveSession(sessionId);
                        result = Errors.Success()
                    } else {
                        result = Errors.SessionAlreadyExists()
                    }
                } catch (err) {
                    result = Errors.SessionAlreadyExists()
                } finally {
                }
            } else {
                result = Errors.MissingParameters()
            }
            break
        case "finish":
            console.log("Finish all sessions.")
            result = Errors.Success()
            break
        case "close":
            if (endpoint.session) {
                const sessionId = endpoint.session
                console.log("Wants to close session '" + sessionId + "'.")
                result = Errors.Success()
            } else {
                result = Errors.MissingParameters();
            }
            break
        case "joinsession":
            if (endpoint.session) {
                const sessionId = endpoint.session
                console.log("Wants to join session '" + sessionId + "'.")
                result = Errors.Success()
            }
            break
       case "lastroll":
            if (endpoint.session) {
                const sessionId = endpoint.session
                console.log("Retrieves last roll for the session '" + sessionId + "'.")
                const storage = new Storage()
                try {
                    const hasSession = await storage.sessionExists(sessionId);
                    console.log("Session '" + sessionId + "' exists: " + hasSession)
                    if (!hasSession) {
                        const lastRoll = await storage.getLastRoll(sessionId);
                        result = Errors.Success();
                        result["data"] = lastRoll;
                    } else {
                        result = Errors.SessionNotFound()
                    }
                } catch (err) {
                    result = Errors.SessionNotFound()
                } finally {
                }
            } else {
                result = Errors.MissingParameters()
            }
            break
        default:
            result = Errors.InvalidEndpoint()
            return
    }

    respuesta.writeHead(result.status)
    respuesta.write(ResponseBuilder.Build(result))
    respuesta.end()
    return
});

(async () => {
    await Storage.createTables()
    .then((result) => {
        console.log("Tables created successfully.")
        return true
    })
    .then((result) => {
        servidor.listen(SERVER_PORT);
        console.log('Servidor web iniciado');
    });
})();

/* API
/register?session=<sessionId>
/finish
/close?session=<sessionId>
/joinsession?session=<sessionId>
/lastroll?session=<sessionId>
*/

