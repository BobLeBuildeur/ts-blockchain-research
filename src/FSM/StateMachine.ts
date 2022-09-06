import Emitter from "../Emitter";
import { createState } from "./state";
import type { State } from "./state";

export type Blackboard = Record<string, unknown>

export default class StateMachine<BB extends Blackboard = Blackboard> extends Emitter {

    protected states: Map<string, State<this>> = new Map<string, State<this>>();

    private currentStateName = 'default';
    private currentState: State<this> = createState<this>('default');

    constructor() {
        super();
    }

    addStates(...state: State<this>[]) {
        state.forEach(s => {
            this.states.set(s.name, s);
        })
    }

    changeState(newSateName: string) {
        const stateName = this.states.get(newSateName);

        if (!stateName) throw new Error(`${newSateName} not registered as a possible state`)

        this.currentState.exit(this);

        this.currentStateName = newSateName;
        this.currentState = stateName;

        this.currentState.enter(this);
        this.emit('state-changed');
    }

    tick(blackboard: BB) {
        const result = this.currentState.tick(this, blackboard);
        if (result != this.currentStateName) {
            this.changeState(result);
        }
    }
}