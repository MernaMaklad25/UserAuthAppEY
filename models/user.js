import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    }
},
{
    timestamps: true
});

userSchema.methods.matchPassword = async function (inputPassword) {
    return await bcrypt.compare(String(inputPassword), this.password);
}

userSchema.pre("save", async function (next) {
    const user = this
    if (!user.isModified("password")) return next()
    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch(error) {
        return next(error);
    }
})
userSchema.plugin(mongoosePaginate);
const User = mongoose.model("User", userSchema);

export default User;