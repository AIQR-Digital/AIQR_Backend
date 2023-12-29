class ErrorWithCode extends Error {

    constructor(message: string, public code: number, name: string, stack?: string) {
        super(message);
        this.name = name || "RunTimeException";
        this.message = message;
        this.stack = stack;
        this.code = code;
    }
}

export {ErrorWithCode};