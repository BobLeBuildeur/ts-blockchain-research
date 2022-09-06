import log from "../log";
import StateMachine, { Blackboard } from "./StateMachine";

export type StateFunction<S extends StateMachine<Blackboard>> = (stateMachine: S) => void
export type StateTickFunction<S extends StateMachine<Blackboard>> = (stateMachine: S, Blackboard: Blackboard) => string

export interface State<S extends StateMachine<Blackboard>> {
    name: string
    enter: StateFunction<S>
    tick: StateTickFunction<S>,
    exit: StateFunction<S>
}

interface OptionalStates<S extends StateMachine<Blackboard>> {
    enter?: StateFunction<S>
    tick?: StateTickFunction<S>,
    exit?: StateFunction<S>
}

export function createState<S extends StateMachine<Blackboard>>(name: string, props: OptionalStates<S> = {}): State<S> {
    return {
        name,
        enter: props.enter || function ({ shortUuid }: S) { log.debug(`${shortUuid}: ${name} state entered`); },
        tick: props.tick || function ({ shortUuid }: S) { log.debug(`${shortUuid}: ${name} state ticked`); return name; },
        exit: props.exit || function ({ shortUuid }: S) { log.debug(`${shortUuid}: ${name} state exited`); }
    } as State<S>
}
