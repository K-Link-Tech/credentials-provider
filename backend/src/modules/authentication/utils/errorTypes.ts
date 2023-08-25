
class DatabaseRequestError extends Error {
    constructor ( msg: string, name?: string) {
        super(msg);
        if (name) {
            this.name = name;
        } else {
            this.name = "500";
        }
    }
}

class BadUserRequestError extends Error {
    constructor ( msg: string, name?: string) {
        super(msg);
        if (name) {
            this.name = name;
        } else {
            this.name = "400";
        }
    }
}

class AuthenticationError extends Error {
    constructor ( msg: string, name?: string) {
        super(msg);
        if (name) {
            this.name = name;
        } else {
            this.name = "401";
        }
    }
}

export { 
    DatabaseRequestError, 
    BadUserRequestError,
    AuthenticationError 
};