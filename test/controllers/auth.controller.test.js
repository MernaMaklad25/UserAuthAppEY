import { expect } from "chai";
import sinon from "sinon";
import User from "../../models/user.js"
import { register, login } from "../../controllers/auth.controller.js";
import jwt from "jsonwebtoken";

describe("Auth Controller Tests",() => {
    afterEach(() => {
        sinon.restore();
    });

    describe("register", () => {
        let req, res, next;
    
        beforeEach(() => {
            req = {
                body: {
                    username: "testuser",
                    email: "test@example.com",
                    password: "password"
                }
            };
            res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            };
            next = sinon.spy();
        });
    
        it("should register a new user successfully", async () => {
            sinon.stub(User, "findOne").resolves(null);
            sinon.stub(User, "create").resolves({
                _id: "123456",
                username: "testuser",
                email: "test@example.com"
            });
    
            await register(req, res, next);
    
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWithExactly({
                _id: "123456",
                username: "testuser",
                email: "test@example.com"
            })).to.be.true;
        });
    
        it("should return 400 if user already exists", async () => {
            sinon.stub(User, "findOne").resolves({ email: "test@example.com" });
    
            await register(req, res, next);
    
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithExactly({ message: "User already exists" })).to.be.true;
        });
    
        it("should return 500 if user creation fails", async () => {
            const error = new Error("Failed to create user")
            sinon.stub(User, "findOne").resolves(null);
            sinon.stub(User, "create").rejects(error);
    
            await register(req, res, next);
    
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.getCall(0).args[0].message).to.equal(error);
        });
    });

    describe("login", () => {
        let req, res, next;
      
        beforeEach(() => {
            req = {
                body: {
                    email: "test@example.com",
                    password: "password123"
                }
            };
            res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            };
            next = sinon.spy();
        });
        it("should login a user successfully and return a token", async () => {
            const user = { _id: "123456", email: "test@example.com", matchPassword: sinon.stub().resolves(true) };
            sinon.stub(User, "findOne").returns({
                select: sinon.stub().returns(Promise.resolve(user))
            });
            sinon.stub(jwt, "sign").returns("generatedTokenTest");

            const expectedResponse = { token: "generatedTokenTest" };
    
            await login(req, res, next);
    
            expect(res.json.calledWithExactly(expectedResponse)).to.be.true;
            expect(next.called).to.be.false;
        });
    
        it("should return 404 if user is not found", async () => {
            sinon.stub(User, "findOne").returns({
                select: sinon.stub().returns(null)
            });
    
            await login(req, res, next);
    
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWithExactly({ message: "User not found" })).to.be.true;
        });
    
        it("should return 401 if password is incorrect", async () => {
            const user = { _id: "123456", email: "test@example.com", matchPassword: sinon.stub().resolves(false) };
            sinon.stub(User, "findOne").returns({
                select: sinon.stub().returns(Promise.resolve(user))
            });
    
            await login(req, res, next);
    
            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWithExactly({ message: "Incorrect password" })).to.be.true;
        });
    });
});
