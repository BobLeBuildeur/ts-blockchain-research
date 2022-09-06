"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Signable_1 = __importDefault(require("./Signable"));
const Auditor_1 = __importDefault(require("./Auditor"));
describe("Signable @integration", () => {
    let auditor;
    let document;
    let signature;
    beforeEach(() => {
        auditor = new Auditor_1.default();
        document = new Signable_1.default();
        signature = Auditor_1.default.sign(document, auditor.privateKey);
        document.sign(signature);
    });
    it("gets signed and verified", () => {
        const fake = new Auditor_1.default();
        assert_1.default.equal(document.verify(fake.publicKey), false);
        assert_1.default.equal(document.verify(auditor.publicKey), true);
    });
    it("requires a correct key to be signed", () => {
        const unsigned = new Signable_1.default();
        assert_1.default.throws(() => {
            document.verify('12345');
        }, Error);
        assert_1.default.throws(() => {
            unsigned.verify(auditor.publicKey);
        }, Error);
    });
});
