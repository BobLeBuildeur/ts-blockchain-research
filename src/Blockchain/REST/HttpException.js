"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(status = 500, message = "Something went wrong") {
        super(message);
        this.status = status;
        this.message = message;
    }
}
exports.default = HttpException;
