export default class HttpException extends Error {
    constructor(readonly status: number = 500, readonly message: string = "Something went wrong") {
        super(message);
    }
}
