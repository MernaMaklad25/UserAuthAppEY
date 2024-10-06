import { expect } from "chai";
import sinon from "sinon";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../../models/user.js";

describe("User Model Tests", () => {
    before(async () => {
        await mongoose.connect(process.env.TEST_DB_URI)
      });
   
      after(async () => {
        await mongoose.connection.close()
    });

    let genSaltStub, hashStub, compareStub;

    beforeEach(async () => {
        genSaltStub = sinon.stub(bcrypt, "genSalt").resolves("salt");
        hashStub = sinon.stub(bcrypt, "hash").resolves("hashedPassword");
        await User.deleteMany({});
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should hash password before saving", async () => {
        const user = new User({
            username: "testuser",
            email: "test@example.com",
            password: "password123"
        });

        await user.save();

        expect(genSaltStub.calledOnce).to.be.true;
        expect(hashStub.calledOnce).to.be.true;
        expect(user.password).to.equal("hashedPassword");
    });

    it("should compare passwords correctly", async () => {
        const user = new User({
            username: "testuser",
            email: "test@example.com",
            password: "hashedPassword"
        });

        compareStub = sinon.stub(bcrypt, "compare").resolves(true);

        const isMatch = await user.matchPassword("password123");

        expect(compareStub.calledOnce).to.be.true;
        expect(isMatch).to.be.true;
    });
});