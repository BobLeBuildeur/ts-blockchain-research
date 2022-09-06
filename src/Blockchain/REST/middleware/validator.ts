import { NextFunction, Response, Request } from "express";
import { Schema } from "joi";
import HttpException from "../HttpException";

export const urlValidator = (schema: Schema) => validator('params', schema);
export const bodyValidator = (schema: Schema) => validator('body', schema);


export const validator = (dataOrigin: string, schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const data = dataOrigin == 'params' ? req.params : req.body

        const { value, error } = schema.validate(data);
        
        if (error) {
            next(new HttpException(400, error.message));
        }

        res.locals.value = value;

        next();
    }
}
