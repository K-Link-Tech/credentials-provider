
class DatabaseRequestError extends Error {
    constructor ( msg: string, name?: string) {
        super(msg);
        if (name) {
            super.name = name;
        } else {
            super.name = "500";
        }
    }
}

class BadUserRequestError extends Error {
    constructor ( msg: string, name?: string) {
        super(msg);
        if (name) {
            super.name = name;
        } else {
            super.name = "400";
        }
    }
}

class AuthenticationError extends Error {
    constructor ( msg: string, name?: string) {
        super(msg);
        if (name) {
            super.name = name;
        } else {
            super.name = "401";
        }
    }
}

export { 
    DatabaseRequestError, 
    BadUserRequestError,
    AuthenticationError 
};