"use strict";
import Errors from "./errors.js";

class ResponseBuilder {
    static Build(err) {
        let obj = new Object()
        if (err.status != Errors.Success().status) {
            obj["status"] = "error"
        }
        obj["message"] = err.message
        return JSON.stringify(obj)
    }

    static Error(params, code) {
        let obj = new Object()
        obj["status"] = "error"
        obj["code"] = code
        obj["message"] = params
        return JSON.stringify(obj)
        
    }

    static Success() {
        return this.Build(Errors.Success()) 
        /*
        let obj = new Object()
        obj["status"] = "success"
        return JSON.stringify(obj)
                */
    }

    static MissingParameters() {
        return ResponseBuilder.Error("Missing Parameters", 422)
    }

    static InvalidEndpoint() {
        return ResponseBuilder.Error("Invalid Endpoint", 404)
    }
}

export default ResponseBuilder;

