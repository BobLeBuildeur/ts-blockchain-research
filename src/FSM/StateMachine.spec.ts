import assert from "assert";
import sinon from "sinon";
import { createState } from "./state";
import StateMachine from "./StateMachine";

describe("StateMachine @integration", () => {


    it("has a default state", () => {
        const sm = new StateMachine();

        /* @ts-ignore */
        assert.equal(sm.states.has('default'), false);

        /* @ts-ignore */
        assert.equal(sm.currentState.name, "default");
    });

    it("has multiple states", () => {
        const sm = new StateMachine();

        sm.addStates(createState('a'));

        /* @ts-ignore */
        assert.equal(sm.states.size, 1)

        sm.addStates(createState('b'), createState('c'))

        /* @ts-ignore */
        assert.equal(sm.states.size, 3)
    });

    it("enters state when tick results in another state's name", () => {
        const sm = new StateMachine();

        const stateA = createState('a', {
            tick: () => {
                return 'b'
            }
        });

        const stateB = createState('b');

        const exitSpy = sinon.spy(stateA, "exit");
        const enterSpy = sinon.spy(stateB, 'enter');

        sm.addStates(stateA, stateB);
        sm.changeState('a');
        sm.tick({});

        assert.equal(exitSpy.called, true, "exited state A");
        assert.equal(enterSpy.called, true, "entered state B");

    });

});