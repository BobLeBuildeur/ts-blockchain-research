"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("./validator");
const sinon_1 = __importDefault(require("sinon"));
const joi_1 = __importDefault(require("joi"));
const assert_1 = __importDefault(require("assert"));
const HttpException_1 = __importDefault(require("../HttpException"));
describe("Validator middleware @unit", () => {
    const schema = joi_1.default.object({
        data: joi_1.default.number(),
        string: joi_1.default.string()
    });
    it("validates proper body", () => {
        const fakeReq = {
            body: {
                data: 1234,
                string: "1234"
            }
        };
        const fakeRes = {
            locals: {}
        };
        const nextSpy = sinon_1.default.spy();
        const middleware = (0, validator_1.validator)("body", schema);
        /* @ts-ignore */
        middleware(fakeReq, fakeRes, nextSpy);
        /* @ts-ignore */
        assert_1.default.deepEqual(fakeRes.locals.value, fakeReq.body);
        assert_1.default.equal(nextSpy.called, true);
    });
    it("Throws for malformed body", () => {
        const fakeReq = {
            body: {
                data: "1234",
                string: 1234
            }
        };
        const fakeRes = {
            locals: {}
        };
        const nextSpy = sinon_1.default.spy();
        const middleware = (0, validator_1.validator)("body", schema);
        /* @ts-ignore */
        middleware(fakeReq, fakeRes, nextSpy);
        assert_1.default.equal(nextSpy.calledWithMatch(sinon_1.default.match.instanceOf(HttpException_1.default)), true);
    });
});
