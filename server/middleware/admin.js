import user from "../models/auth.js";

const admin = async (req, res, next) => {
  try {
    const currentUser = await user.findById(req.userid);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (currentUser.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export default admin;