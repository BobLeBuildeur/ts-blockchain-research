"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const state_1 = require("./state");
describe("State @unit", () => {
    it("creates a working State object", () => {
        const newState = (0, state_1.createState)('name');
        assert_1.default.equal(newState.name, 'name');
    });
});
