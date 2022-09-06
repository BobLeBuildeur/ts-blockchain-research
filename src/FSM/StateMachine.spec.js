"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const sinon_1 = __importDefault(require("sinon"));
const state_1 = require("./state");
const StateMachine_1 = __importDefault(require("./StateMachine"));
describe("StateMachine @integration", () => {
    it("has a default state", () => {
        const sm = new StateMachine_1.default();
        /* @ts-ignore */
        assert_1.default.equal(sm.states.has('default'), false);
        /* @ts-ignore */
        assert_1.default.equal(sm.currentState.name, "default");
    });
    it("has multiple states", () => {
        const sm = new StateMachine_1.default();
        sm.addStates((0, state_1.createState)('a'));
        /* @ts-ignore */
        assert_1.default.equal(sm.states.size, 1);
        sm.addStates((0, state_1.createState)('b'), (0, state_1.createState)('c'));
        /* @ts-ignore */
        assert_1.default.equal(sm.states.size, 3);
    });
    it("enters state when tick results in another state's name", () => {
        const sm = new StateMachine_1.default();
        const stateA = (0, state_1.createState)('a', {
            tick: () => {
                return 'b';
            }
        });
        const stateB = (0, state_1.createState)('b');
        const exitSpy = sinon_1.default.spy(stateA, "exit");
        const enterSpy = sinon_1.default.spy(stateB, 'enter');
        sm.addStates(stateA, stateB);
        sm.changeState('a');
        sm.tick({});
        assert_1.default.equal(exitSpy.called, true, "exited state A");
        assert_1.default.equal(enterSpy.called, true, "entered state B");
    });
});
