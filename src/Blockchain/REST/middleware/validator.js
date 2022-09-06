"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = exports.bodyValidator = exports.urlValidator = void 0;
const HttpException_1 = __importDefault(require("../HttpException"));
const urlValidator = (schema) => (0, exports.validator)('params', schema);
exports.urlValidator = urlValidator;
const bodyValidator = (schema) => (0, exports.validator)('body', schema);
exports.bodyValidator = bodyValidator;
const validator = (dataOrigin, schema) => {
    return (req, res, next) => {
        const data = dataOrigin == 'params' ? req.params : req.body;
        const { value, error } = schema.validate(data);
        if (error) {
            next(new HttpException_1.default(400, error.message));
        }
        res.locals.value = value;
        next();
    };
};
exports.validator = validator;
