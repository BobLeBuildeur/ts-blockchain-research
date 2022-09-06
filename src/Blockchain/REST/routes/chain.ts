import { NextFunction, Request, Response } from "express";
import Chain from "../../Chain";


export const getChain = (chain: Chain) => {
    return (_req: Request, res: Response, next: NextFunction) => {
        res.locals.send = JSON.parse(chain.toString());

        next();
    }
}