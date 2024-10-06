import User from "../models/user.js"

const listUserProfiles = async (req, res, next) => {
    const { page, size, sortBy, orderBy, ...filters } = req.query;
    const pageNumber = page || 1;
    const pageSize = size || 10;
    const options = {}
    options[sortBy] = orderBy === "asc" ? 1 : -1; 
    User.paginate(filters, { page: pageNumber, limit: pageSize, sort: (options) }, (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error occurred while fetching users." });
        }
      
        const { docs, page, totalDocs, totalPages } = result;
        res.json({ 
            users: docs,
            currentPage: page,
            totalUsers: totalDocs,
            totalNumberOfPages: totalPages });
      });
}

const getUserProfile = async (req, res, next) => {
    const user = req.user
    res.json({
        _id: user._id,
        username: user.username,
        email: user.email
    });
}

const updateUserProfile = async (req, res, next) => {
    const user = req.user
    try {
        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
      res.status(500).json({ message: err });
    }
}

const deleteUserProfile = async (req, res, next) => {
    const user = req.user
    try {
        await User.deleteOne({ _id: user._id });
        res.json({ message: "User removed" });
    } catch (err) {
        res.status(500).json({ message: err })
    }
}
export { getUserProfile, updateUserProfile, deleteUserProfile, listUserProfiles }