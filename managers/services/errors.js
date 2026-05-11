class ErrorCodes {
    // Generic errors
    static MissingParameters = 400;
    static InvalidEndpoint = 404;
    static InternalServerError = 500;
    static Success = 200;

    // ---------------> Session management errors <---------------
    static SessionErrorBase = 600;
    
    // Creation
    static SessionAlreadyExists = this.SessionErrorBase + 1;

    // Joining
    static SessionNotFound = this.SessionErrorBase + 2;
}

class Errors {
    // Generic errors
    static MissingParameters() {
        return {
            status: ErrorCodes.MissingParameters,
            message: "Missing parameters",
            error: true
        }
    }
    static InvalidEndpoint() {
        return {
            status: ErrorCodes.InvalidEndpoint,
            message: "Invalid endpoint",
            error: true
        }
    }   
    static InternalServerError() {
        return {
            status: ErrorCodes.InternalServerError,
            message: "Internal server error",
            error: true
        }
    }
    static Success() {
        return {
            status: ErrorCodes.Success,
            message: "Success",
            error: false
        }
    }
    
    // Session errors
    static SessionAlreadyExists() {
        return {
            status: ErrorCodes.SessionAlreadyExists,
            message: "Session already exists",
            error: true
        }
    }
    static SessionNotFound() {
        return {
            status: ErrorCodes.SessionNotFound,
            message: "Session not found",
            error: true
        }
    }
}

export default Errors;