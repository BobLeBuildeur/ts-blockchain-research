import Unique from "./Unique";

export type HandlerFunction = (...data: string[]) => void

export type Handler = {
    caller: Emitter | Record<string, unknown>,
    handler: HandlerFunction
}


export default class Emitter extends Unique {

    private handlers = new Map<string, Handler[]>();

    on(event: string, handler: HandlerFunction, caller = {}) {

        let fns = this.handlers.get(event);

        const handlerObject: Handler = {
            caller,
            handler
        }

        if (fns == undefined) {
            fns = [handlerObject];
        } else {
            fns.push(handlerObject);
        }

        this.handlers.set(event, fns);
    }

    emit(event: string, ...data: string[]) {
        const fns = this.handlers.get(event);

        if (!fns) return;

        fns.forEach(fn => {
            fn.handler.call(fn.caller, ...data);
        });
    }
}