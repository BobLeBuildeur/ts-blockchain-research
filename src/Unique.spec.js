"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const crypto_1 = require("crypto");
const Unique_1 = __importDefault(require("./Unique"));
describe("Unique @unit", () => {
    it("has random uuid", () => {
        const a = new Unique_1.default();
        const b = new Unique_1.default();
        const c = new Unique_1.default();
        const d = new Unique_1.default();
        assert_1.default.notEqual(a.uuid, b.uuid);
        assert_1.default.notEqual(a.uuid, c.uuid);
        assert_1.default.notEqual(a.uuid, d.uuid);
        assert_1.default.notEqual(b.uuid, a.uuid);
        assert_1.default.notEqual(b.uuid, c.uuid);
        assert_1.default.notEqual(b.uuid, d.uuid);
        assert_1.default.notEqual(c.uuid, a.uuid);
        assert_1.default.notEqual(c.uuid, b.uuid);
        assert_1.default.notEqual(c.uuid, d.uuid);
        assert_1.default.notEqual(d.uuid, a.uuid);
        assert_1.default.notEqual(d.uuid, b.uuid);
        assert_1.default.notEqual(d.uuid, c.uuid);
    });
    it("can be created with existing uuid", () => {
        const unique = new Unique_1.default("1234");
        assert_1.default.equal(unique.uuid, "1234");
    });
    it("can be deeply compared", () => {
        const a = new Unique_1.default();
        const b = new Unique_1.default();
        assert_1.default.equal(a.equals(b), false);
        const c = new Unique_1.default('1234');
        const d = new Unique_1.default('1234');
        assert_1.default.equal(c.equals(d), true);
        // @ts-ignore
        c.a = 1;
        // @ts-ignore
        d.b = 1;
        assert_1.default.equal(c.equals(d), false);
    });
    it("validates uuids", () => {
        const validUuids = Array.from({ length: 5 }, () => (0, crypto_1.randomUUID)());
        validUuids.forEach(uuid => {
            assert_1.default.equal(Unique_1.default.validateUuid(uuid), true);
        });
        const invalidUuids = [
            "not a valid uid",
            "definitely-not-a-uuid",
            "c73bcdcc-2669-4bf6-81d3-e4an73fb11fd",
            "c73bcdcc26694bf681d3e4ae73fb11fd",
            "6a2f41a3-c54c-fce8-32d2-0324e1",
        ];
        invalidUuids.forEach(uuid => {
            assert_1.default.equal(Unique_1.default.validateUuid(uuid), false);
        });
    });
});
