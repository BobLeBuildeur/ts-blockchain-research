import assert from "assert";
import { randomUUID } from "crypto";
import Unique from "./Unique";

describe("Unique @unit", () => {
    it("has random uuid", () => {
        const a = new Unique();
        const b = new Unique();
        const c = new Unique();
        const d = new Unique();

        assert.notEqual(a.uuid, b.uuid);
        assert.notEqual(a.uuid, c.uuid);
        assert.notEqual(a.uuid, d.uuid);
        assert.notEqual(b.uuid, a.uuid);
        assert.notEqual(b.uuid, c.uuid);
        assert.notEqual(b.uuid, d.uuid);
        assert.notEqual(c.uuid, a.uuid);
        assert.notEqual(c.uuid, b.uuid);
        assert.notEqual(c.uuid, d.uuid);
        assert.notEqual(d.uuid, a.uuid);
        assert.notEqual(d.uuid, b.uuid);
        assert.notEqual(d.uuid, c.uuid);
    });

    it("can be created with existing uuid", () => {
        const unique = new Unique("1234");

        assert.equal(unique.uuid, "1234");
    })

    it("can be deeply compared", () => {
        const a = new Unique();
        const b = new Unique();

        assert.equal(a.equals(b), false);

        const c = new Unique('1234');
        const d = new Unique('1234');

        assert.equal(c.equals(d), true);

        // @ts-ignore
        c.a = 1;

        // @ts-ignore
        d.b = 1;

        assert.equal(c.equals(d), false);
    })

    it("validates uuids", () => {
        const validUuids = Array.from({length: 5}, () => randomUUID());
        
        validUuids.forEach(uuid => {
            assert.equal(Unique.validateUuid(uuid), true)
        });

        const invalidUuids = [
            "not a valid uid",
            "definitely-not-a-uuid",
            "c73bcdcc-2669-4bf6-81d3-e4an73fb11fd",
            "c73bcdcc26694bf681d3e4ae73fb11fd",
            "6a2f41a3-c54c-fce8-32d2-0324e1",
        ];
        
        invalidUuids.forEach(uuid => {
            assert.equal(Unique.validateUuid(uuid), false)
        });


    });
})