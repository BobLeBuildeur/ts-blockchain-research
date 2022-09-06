import { validator } from "./validator";
import sinon from "sinon";
import Joi from "joi";
import assert from "assert";
import HttpException from "../HttpException";

describe("Validator middleware @unit", () => {

    const schema = Joi.object({
        data: Joi.number(),
        string: Joi.string()
    })

    it ("validates proper body", () => {
        const fakeReq =  {
            body: {
                data: 1234,
                string: "1234"
            }
        };

        const fakeRes = {
            locals: {}
        };

        const nextSpy = sinon.spy()

        const middleware = validator("body", schema);

        /* @ts-ignore */
        middleware(fakeReq, fakeRes, nextSpy);

        /* @ts-ignore */
        assert.deepEqual(fakeRes.locals.value, fakeReq.body);
        assert.equal(nextSpy.called, true);

    });

    it ("Throws for malformed body", () => {
        const fakeReq =  {
            body: {
                data: "1234",
                string: 1234
            }
        };

        const fakeRes = {
            locals: {}
        };

        const nextSpy = sinon.spy()

        const middleware = validator("body", schema);

        /* @ts-ignore */
        middleware(fakeReq, fakeRes, nextSpy);
        assert.equal(nextSpy.calledWithMatch(sinon.match.instanceOf(HttpException)), true);
    })

})