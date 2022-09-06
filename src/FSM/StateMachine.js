"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Emitter_1 = __importDefault(require("../Emitter"));
const state_1 = require("./state");
class StateMachine extends Emitter_1.default {
    constructor() {
        super();
        this.states = new Map();
        this.currentStateName = 'default';
        this.currentState = (0, state_1.createState)('default');
    }
    addStates(...state) {
        state.forEach(s => {
            this.states.set(s.name, s);
        });
    }
    changeState(newSateName) {
        const stateName = this.states.get(newSateName);
        if (!stateName)
            throw new Error(`${newSateName} not registered as a possible state`);
        this.currentState.exit(this);
        this.currentStateName = newSateName;
        this.currentState = stateName;
        this.currentState.enter(this);
        this.emit('state-changed');
    }
    tick(blackboard) {
        const result = this.currentState.tick(this, blackboard);
        if (result != this.currentStateName) {
            this.changeState(result);
        }
    }
}
exports.default = StateMachine;
