import { expect } from "chai";
import sinon from "sinon";
import User from "../../models/user.js"
import { listUserProfiles, getUserProfile, updateUserProfile, deleteUserProfile } from "../../controllers/user.controller.js";

describe("User Controller Tests", () => {
    afterEach(() => {
        sinon.restore();
    });

    describe("getUserProfile", () => {
        let mockUser = { _id: "12345", username: "testUser", email: "test@example.com" };

        it("should return user profile details", async () => {
            const req = { user: mockUser };
            const res = { json: sinon.spy() };

            await getUserProfile(req, res);

            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(mockUser)).to.be.true;
        });
    })

    describe("updateUserProfile", () => {
        let req, res;
    
        beforeEach(() => {
            req = {
                user: {
                    _id: "1234",
                    username: "oldUsername",
                    email: "old@example.com",
                    save: sinon.stub().resolves({ _id: "1234", username: "newUsername", email: "new@example.com" })
                },
                body: {
                    username: "newUsername",
                    email: "new@example.com"
                }
            };
            res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            };
        });
    
        it("should update user profile with new username and email", async () => {
            await updateUserProfile(req, res);
            
            expect(req.user.username).to.equal("newUsername");
            expect(req.user.email).to.equal("new@example.com");
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWithExactly({ _id: "1234", username: "newUsername", email: "new@example.com" })).to.be.true;
        });
    
        it("should return 404 if user is not found", async () => {
            req.user = null;
    
            await updateUserProfile(req, res);
    
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWithExactly({ message: "User not found" })).to.be.true;
        });
    
        it("should return 500 if an error occurs", async () => {
            const error = new Error("Internal Server Error");
            req.user.save.rejects(error);
    
            await updateUserProfile(req, res);
    
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.getCall(0).args[0].message).to.equal(error);
        });
    });

    describe("deleteUserProfile", () => {
        let req, res

        beforeEach(() => {
            res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
        })
        req = { user: {
            _id: "12345",
            username: "testUser",
            email: "test@example.com"
        }};

        it("should delete user successfully", async () => {
            const deleteOneStub = sinon.stub(User, "deleteOne").resolves();
            await deleteUserProfile(req, res)

            expect(deleteOneStub).to.have.been.calledOnce
            expect(deleteOneStub).to.have.been.calledWith({_id: "12345"})
            expect(res.json.calledWith({ message: "User removed" })).to.be.true;
        });

        it("should handle errors when deleting user profile", async () => {
            const error = new Error("Internal server error");
            const deleteOneStub = sinon.stub(User, "deleteOne").rejects(error);
    
            await deleteUserProfile(req, res);
    
            expect(deleteOneStub).to.have.been.calledWith({_id: "12345"})
            expect(res.status).to.have.been.calledWith(500);
            expect(res.json.getCall(0).args[0].message).to.equal(error);
        });

    });

    describe("listUserProfiles", () => {
        let res
        beforeEach(() => {
            res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            };
        })
        it("should list user profiles successfully", async () => {
            const req = {
                query: {
                    page: 1,
                    size: 10,
                    sortBy: "username",
                    orderBy: "asc"
                }
            };
            const mockResult = {
                docs: [{ username: "User 1" }, { username: "User 2" }],
                page: 1,
                totalDocs: 2,
                totalPages: 1
            };
    
            const paginateStub = sinon.stub(User, "paginate").callsFake(({}, options, callback) => {
                callback(null, mockResult);
            });
    
            await listUserProfiles(req, res);
    
            expect(paginateStub).to.have.been.calledOnce
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.getCall(0).args[0]).to.deep.equal({
                users: mockResult.docs,
                currentPage: mockResult.page,
                totalUsers: mockResult.totalDocs,
                totalNumberOfPages: mockResult.totalPages
            });
        });
    
        it("should handle errors when listing user profiles", async () => {
            const req = { query: {} };
            const error = new Error("Internal server error");
            const paginateStub = sinon.stub(User, "paginate").callsFake(({}, options, callback) => {
                callback(error);
            });
    
            await listUserProfiles(req, res);
    
            expect(paginateStub).to.have.been.calledOnce
            expect(res.status).to.have.been.calledWith(500);
            expect(res.json.calledWith({ message: "Error occurred while fetching users." })).to.be.true;
        });
    });
})