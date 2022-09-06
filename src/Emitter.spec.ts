import assert from "assert";
import Emitter from "./Emitter";

describe("Emitter @unit", () => {

    it ('can emit events, that are listented to', (done) => {
        const e = new Emitter();

        const spy = (value: string) => {
            assert.equal(value, "yes!")
            done();
        }

        e.on("random-event", spy);

        e.emit("random-event", "yes!");
    })
})