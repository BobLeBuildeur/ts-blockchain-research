"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.response = void 0;
const response = (_req, res) => {
    const send = {
        ok: true,
    };
    if (res.locals.send)
        send.value = res.locals.send;
    res.send(send);
};
exports.response = response;
const error = (err, _req, res, _next) => {
    res.status(err.status);
    res.json({
        ok: false,
        error: err.message
    });
};
exports.error = error;
