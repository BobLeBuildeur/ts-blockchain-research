"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createState = void 0;
const log_1 = __importDefault(require("../log"));
function createState(name, props = {}) {
    return {
        name,
        enter: props.enter || function ({ shortUuid }) { log_1.default.debug(`${shortUuid}: ${name} state entered`); },
        tick: props.tick || function ({ shortUuid }) { log_1.default.debug(`${shortUuid}: ${name} state ticked`); return name; },
        exit: props.exit || function ({ shortUuid }) { log_1.default.debug(`${shortUuid}: ${name} state exited`); }
    };
}
exports.createState = createState;
