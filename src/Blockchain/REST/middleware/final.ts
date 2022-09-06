import { NextFunction, Request, Response } from "express";
import HttpException from "../HttpException";

type ResponseJson = {
    ok: boolean
    value?: string | number | Record<string, unknown>
}

export const response = (_req: Request, res: Response) => {
    const send = {
        ok: true,
    } as ResponseJson

    if (res.locals.send) send.value = res.locals.send;
    
    res.send(send);
}

export const error = (err: HttpException, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.status);
    res.json({ 
        ok: false,
        error: err.message
    });
}