import assert from "assert";
import Signable from "./Signable";
import Auditor from "./Auditor";
import { hash } from "../../Unique";


describe("Signable @integration", () => {
    let auditor: Auditor;
    let document: Signable;
    let signature: hash;

    beforeEach(() => {
        auditor = new Auditor();
        document = new Signable();

        signature = Auditor.sign(document, auditor.privateKey);
        document.sign(signature);
    })

    it("gets signed and verified", () => {
        const fake = new Auditor();

        assert.equal(document.verify(fake.publicKey), false);
        assert.equal(document.verify(auditor.publicKey), true);
    });

    it("requires a correct key to be signed", () => {
        const unsigned = new Signable();
        

        assert.throws(() => {
            document.verify('12345');
        }, Error);

        assert.throws(() => {
            unsigned.verify(auditor.publicKey);
        }, Error)
    });
});