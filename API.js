"use strict";

import Utilities from './utilities.js';

class API {
    static endpoints = [
        "register",
        "finish",
        "close",
        "joinsession",
        "lastroll"
    ]

    static getEndPoints = [
        "lastroll"
    ]

    static postEndPoints = [
        "register",
        "finish",
        "close",
        "joinsession"
    ]

    static canBeHandled(endpoint) {
        const url = Utilities.convertURL(endpoint);
        if (this.endpoints.includes(url.path)) {
            if (endpoint.method === "GET" && this.getEndPoints.includes(url.path)) {
                return true
            } else if (endpoint.method === "POST" && this.postEndPoints.includes(url.path)) {
                return true
            }
        }
        return false
    }
}


export default API;
