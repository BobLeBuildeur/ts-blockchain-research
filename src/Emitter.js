"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Unique_1 = __importDefault(require("./Unique"));
class Emitter extends Unique_1.default {
    constructor() {
        super(...arguments);
        this.handlers = new Map();
    }
    on(event, handler, caller = {}) {
        let fns = this.handlers.get(event);
        const handlerObject = {
            caller,
            handler
        };
        if (fns == undefined) {
            fns = [handlerObject];
        }
        else {
            fns.push(handlerObject);
        }
        this.handlers.set(event, fns);
    }
    emit(event, ...data) {
        const fns = this.handlers.get(event);
        if (!fns)
            return;
        fns.forEach(fn => {
            fn.handler.call(fn.caller, ...data);
        });
    }
}
exports.default = Emitter;
