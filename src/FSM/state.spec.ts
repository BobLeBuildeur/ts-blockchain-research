import assert from "assert";
import { createState } from "./state";

describe("State @unit", () => {

    it("creates a working State object", () => {
        const newState = createState('name');

        assert.equal(newState.name, 'name');
    });
});