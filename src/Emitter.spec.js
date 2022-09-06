"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Emitter_1 = __importDefault(require("./Emitter"));
describe("Emitter @unit", () => {
    it('can emit events, that are listented to', (done) => {
        const e = new Emitter_1.default();
        const spy = (value) => {
            assert_1.default.equal(value, "yes!");
            done();
        };
        e.on("random-event", spy);
        e.emit("random-event", "yes!");
    });
});
