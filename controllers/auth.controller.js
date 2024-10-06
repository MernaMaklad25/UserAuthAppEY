import User from "../models/user.js"
import generateToken from "../utils/generateToken.js";

const register = async (req, res, next) => {
    const { username, email, password } = req.body
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User.create({ username, email, password });
        if (user){
            res.status(201).json({
              _id: user._id,
              username: user.username,
              email: user.email
            });
          } else {
            res.status(400).json({ message: "Invalid user data" });
          }
    } catch(err) {
        res.status(500).json({ message: err })
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email }).select("password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const passwordMatched = await user.matchPassword(password)
        if (!passwordMatched) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        const token = generateToken(user._id);
    
        res.json({ token: token });
 
    } catch(error) {
        res.status(500).json({ message: err })
    }
};

export { register, login }