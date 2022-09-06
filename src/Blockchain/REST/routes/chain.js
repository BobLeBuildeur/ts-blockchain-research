"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChain = void 0;
const getChain = (chain) => {
    return (_req, res, next) => {
        res.locals.send = JSON.parse(chain.toString());
        next();
    };
};
exports.getChain = getChain;
