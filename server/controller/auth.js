import mongoose from "mongoose";
import user from "../models/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import notification from "../models/notification.js";
import loginHistory from "../models/loginHistory.js";
import session from "../models/session.js";
import otpModel from "../models/otp.js";
import trustedDevice from "../models/trustedDevice.js";
import forgotPassword from "../models/forgotPassword.js";
import reputationHistory from "../models/reputationHistory.js";
export const Signup = async (req, res) => {
  const { name, email, password ,phone } = req.body;
  try {
    const exisitinguser = await user.findOne({ email });
    if (exisitinguser) {
      return res.status(404).json({ message: "User already exist" });
    }
    const hashpassword = await bcrypt.hash(password, 12);
    const newuser = await user.create({
  name,
  email,
  phone ,
  password: hashpassword,
});

    const token = jwt.sign(
      { email: newuser.email, id: newuser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
     
    
    res.status(200).json({ data: newuser, token });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};
   export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exisitinguser = await user.findOne({ email });

    // 1. User does not exist
    if (!exisitinguser) {
      await loginHistory.create({
        userid: "",
        email: email || "",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        status: "failed",
      });

      return res.status(404).json({
        message: "User does not exist",
      });
    }

    // 2. Check password
    const ispasswordcrct = await bcrypt.compare(
      password,
      exisitinguser.password
    );

    // 3. Wrong password
    if (!ispasswordcrct) {
      await loginHistory.create({
        userid: String(exisitinguser._id),
        email: exisitinguser.email,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        status: "failed",
      });

      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // 4. Check suspended user
    if (exisitinguser.suspended) {
      await loginHistory.create({
        userid: String(exisitinguser._id),
        email: exisitinguser.email,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        status: "failed",
      });

      return res.status(403).json({
        message: "Your account has been suspended",
      });
    }

    // 5. Get current device information
    const userAgent = req.headers["user-agent"] || "";
    const ipAddress = req.ip || "";

    // 6. Check whether current device is trusted
    const trusted = await trustedDevice.findOne({
      userid: String(exisitinguser._id),
      userAgent: userAgent,
      isTrusted: true,
    });

    // 7. If device is NOT trusted → generate OTP
    if (!trusted) {
      const otp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const expiresAt = new Date(
        Date.now() + 5 * 60 * 1000
      );

      // Delete old OTP
      await otpModel.deleteMany({
        userid: String(exisitinguser._id),
      });

      // Save login OTP
      await otpModel.create({
        userid: String(exisitinguser._id),
        email: exisitinguser.email,
        otp: otp,
        expiresAt: expiresAt,
        purpose: "login",
      });

      // Development purpose
      console.log("LOGIN OTP:", otp);

      return res.status(200).json({
        requiresOTP: true,
        email: exisitinguser.email,
        message: "OTP required for this device",
      });
    }

    // 8. Trusted device → normal login
    const token = jwt.sign(
      {
        email: exisitinguser.email,
        id: exisitinguser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // 9. Save successful login history
    await loginHistory.create({
      userid: String(exisitinguser._id),
      email: exisitinguser.email,
      ipAddress: ipAddress,
      userAgent: userAgent,
      status: "success",
    });

    // 10. Create active session
    await session.create({
      userid: String(exisitinguser._id),
      token: token,
      ipAddress: ipAddress,
      userAgent: userAgent,
      loginTime: new Date(),
      isActive: true,
    });

    // 11. Login success
    return res.status(200).json({
      requiresOTP: false,
      data: exisitinguser,
      token,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const getallusers = async (req, res) => {
  try {
    const alluser = await user.find();
    res.status(200).json({ data: alluser });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};
 // ======================================================
// UPDATE PROFILE
 
// ======================================================
export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;

  const { name, about, tags } = req.body.editForm;

  // Check valid user ID
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({
      message: "User unavailable",
    });
  }

  try {
    // ==========================================
    // FIND USER
    // ==========================================

    const existingUser = await user.findById(_id);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ==========================================
    // UPDATE PROFILE DETAILS
    // ==========================================

    existingUser.name = name ?? existingUser.name;

    existingUser.about = about ?? existingUser.about;

    existingUser.tags = tags ?? existingUser.tags;

    // ==========================================
    // CHECK PROFILE COMPLETION
    // Mandatory details:
    // name
    // email
    // phone
    // about
    // tags
    // ==========================================

    const profileCompleted =
      existingUser.name &&
      existingUser.name.trim() !== "" &&

      existingUser.email &&
      existingUser.email.trim() !== "" &&

      existingUser.phone &&
      existingUser.phone.trim() !== "" &&

      existingUser.about &&
      existingUser.about.trim() !== "" &&

      Array.isArray(existingUser.tags) &&
      existingUser.tags.length > 0;


    // ==========================================
    // GIVE +10 REPUTATION ONLY ONCE
    // ==========================================

    if (
      profileCompleted &&
      existingUser.profileBonusAwarded !== true
    ) {

      // Add 10 reputation
      existingUser.reputation =
        (existingUser.reputation || 0) + 10;

      // Prevent giving bonus again
      existingUser.profileBonusAwarded = true;

      // ==========================================
      // REPUTATION HISTORY
      // ==========================================

      await reputationHistory.create({
        userid: String(existingUser._id),
        points: 10,
        reason: "Completed profile",
        type: "earned",
        relatedUserId: "",
      });
    }


    // ==========================================
    // SAVE USER
    // ==========================================

    await existingUser.save();


    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      message: profileCompleted
        ? "Profile updated successfully and 10 reputation points awarded"
        : "Profile updated successfully",
      data: existingUser,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// Follow / Unfollow user
export const followuser = async (req, res) => {
  const { id: targetUserId } = req.params;
  const currentUserId = req.userid;

  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    return res.status(400).json({
      message: "User unavailable",
    });
  }

  if (String(currentUserId) === String(targetUserId)) {
    return res.status(400).json({
      message: "You cannot follow yourself",
    });
  }

  try {
    const currentUser = await user.findById(currentUserId);
    const targetUser = await user.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyFollowing = currentUser.following.includes(
      String(targetUserId)
    );

    if (!alreadyFollowing) {
      // Follow
      currentUser.following.push(String(targetUserId));
      targetUser.followers.push(String(currentUserId));

      await currentUser.save();

      await targetUser.save();
      // Create follow notification
     await notification.create({
     recipient: String(targetUserId),
     sender: String(currentUserId),
     type: "follow",
      message: "Someone started following you",
     });
      return res.status(200).json({
        message: "User followed successfully",
        data: {
          following: currentUser.following,
          followers: targetUser.followers,
        },
      });
    }

    // Unfollow
    currentUser.following = currentUser.following.filter(
      (id) => id !== String(targetUserId)
    );

    targetUser.followers = targetUser.followers.filter(
      (id) => id !== String(currentUserId)
    );

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({
      message: "User unfollowed successfully",
      data: {
        following: currentUser.following,
        followers: targetUser.followers,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const getLoginHistory = async (req, res) => {
  try {
    const history = await loginHistory
      .find({ userid: String(req.userid) })
      .sort({ loginTime: -1 });

    res.status(200).json({
      message: "Login history fetched successfully",
      data: history,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const getActiveSessions = async (req, res) => {
  try {
    const sessions = await session
      .find({
        userid: String(req.userid),
        isActive: true,
      })
      .select("-token")
      .sort({ loginTime: -1 });

    res.status(200).json({
      message: "Active sessions fetched successfully",
      data: sessions,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const revokeSession = async (req, res) => {
  const { id: sessionId } = req.params;

  try {
    const sessionDoc = await session.findById(sessionId);

    if (!sessionDoc) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (String(sessionDoc.userid) !== String(req.userid)) {
      return res.status(403).json({
        message: "You cannot revoke this session",
      });
    }

    sessionDoc.isActive = false;

    await sessionDoc.save();

    res.status(200).json({
      message: "Session revoked successfully",
      data: sessionDoc,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const generateOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  try {
    const existingUser = await user.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expires after 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Remove previous OTPs for this user
    await otpModel.deleteMany({
      userid: String(existingUser._id),
    });

    // Save new OTP
    await otpModel.create({
      userid: String(existingUser._id),
      email: existingUser.email,
      otp: otp,
      expiresAt: expiresAt,
      purpose: "general",
    });
    console.log("OTP:", otp);
    res.status(200).json({
      message: "OTP generated successfully",
      expiresAt: expiresAt,
    });

    // Development only:
    console.log("OTP:", otp);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
 export const verifyOTP = async (req, res) => {
  const { email, otp ,trustDevice} = req.body;

  try {
    // Find OTP
    const otpDoc = await otpModel.findOne({
      email,
      otp,
      verified: false,
    });

    if (!otpDoc) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Check expiry
    if (otpDoc.expiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // Mark OTP as verified
    otpDoc.verified = true;
    await otpDoc.save();

    // -----------------------------------------
    // LOGIN OTP
    // -----------------------------------------
    if (otpDoc.purpose === "login") {
      const existingUser = await user.findOne({ email });

      if (!existingUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const userAgent = req.headers["user-agent"] || "";
      const ipAddress = req.ip || "";
       // Trust this device
if (trustDevice) {
  await trustedDevice.findOneAndUpdate(
    {
      userid: String(existingUser._id),
      userAgent: userAgent,
    },
    {
      userid: String(existingUser._id),
      deviceName: "Trusted Device",
      userAgent: userAgent,
      ipAddress: ipAddress,
      trustedAt: new Date(),
      isTrusted: true,
    },
    {
      upsert: true,
      new: true,
    }
  );
}
      // Generate JWT
      const token = jwt.sign(
        {
          email: existingUser.email,
          id: existingUser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Save successful login history
      await loginHistory.create({
        userid: String(existingUser._id),
        email: existingUser.email,
        ipAddress: ipAddress,
        userAgent: userAgent,
        status: "success",
      });

      // Create active session
      await session.create({
        userid: String(existingUser._id),
        token: token,
        ipAddress: ipAddress,
        userAgent: userAgent,
        loginTime: new Date(),
        isActive: true,
      });

      return res.status(200).json({
        message: "Login successful",
        requiresOTP: false,
        data: existingUser,
        token,
      });
    }

    // -----------------------------------------
    // GENERAL OTP
    // -----------------------------------------
    return res.status(200).json({
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const addTrustedDevice = async (req, res) => {
  const { deviceName } = req.body;

  try {
    const existingDevice = await trustedDevice.findOne({
      userid: String(req.userid),
      userAgent: req.headers["user-agent"],
      isTrusted: true,
    });

    if (existingDevice) {
      return res.status(400).json({
        message: "This device is already trusted",
      });
    }

    const newDevice = await trustedDevice.create({
      userid: String(req.userid),
      deviceName: deviceName || "Unknown Device",
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      isTrusted: true,
    });

    res.status(201).json({
      message: "Device trusted successfully",
      data: newDevice,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const getTrustedDevices = async (req, res) => {
  try {
    const devices = await trustedDevice
      .find({
        userid: String(req.userid),
        isTrusted: true,
      })
      .sort({ trustedAt: -1 });

    res.status(200).json({
      message: "Trusted devices fetched successfully",
      data: devices,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const removeTrustedDevice = async (req, res) => {
  const { id: deviceId } = req.params;

  try {
    const device = await trustedDevice.findById(deviceId);

    if (!device) {
      return res.status(404).json({
        message: "Trusted device not found",
      });
    }

    if (String(device.userid) !== String(req.userid)) {
      return res.status(403).json({
        message: "You cannot remove this device",
      });
    }

    device.isTrusted = false;
    await device.save();

    res.status(200).json({
      message: "Trusted device removed successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// =====================================
// FORGOT PASSWORD - REQUEST OTP
// =====================================
export const forgotPasswordRequest = async (req, res) => {
  const { email ,phone} = req.body;

  try {
     if (!email && !phone) {
  return res.status(400).json({
    message: "Email or phone number is required",
  });
}

    // Find user
     const existingUser = await user.findOne({
  $or: [
    ...(email ? [{ email }] : []),
    ...(phone ? [{ phone }] : []),
  ],
});

    if (!existingUser) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    // Check whether user already requested
    // forgot password today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayRequest = await forgotPassword.findOne({
      userid: String(existingUser._id),
      requestedAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (todayRequest) {
      return res.status(429).json({
        message: "You can use this option only one time per day",
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP valid for 5 minutes
    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await forgotPassword.create({
      userid: String(existingUser._id),
      email: existingUser.email,
      otp,
      expiresAt,
      requestedAt: new Date(),
      verified: false,
    });

    // Development purpose
    console.log("FORGOT PASSWORD OTP:", otp);

    return res.status(200).json({
      message: "OTP sent successfully",
      email: existingUser.email,
       phone: existingUser.phone,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};


// =====================================
// FORGOT PASSWORD - VERIFY OTP
// =====================================
 export const forgotPasswordVerify = async (req, res) => {
  const { email, phone, otp } = req.body;

  try {
    // Email or phone required
    if ((!email && !phone) || !otp) {
      return res.status(400).json({
        message: "Email/phone and OTP are required",
      });
    }

    // Find user using email OR phone
    const existingUser = await user.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    // Find latest OTP
    const otpDoc = await forgotPassword
      .findOne({
        userid: String(existingUser._id),
        otp: String(otp),
        verified: false,
      })
      .sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Check OTP expiry
    if (new Date() > otpDoc.expiresAt) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // Mark OTP verified
    otpDoc.verified = true;
    await otpDoc.save();

    // Generate password
    // Only A-Z and a-z
    const letters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    let newPassword = "";

    for (let i = 0; i < 10; i++) {
      newPassword +=
        letters[Math.floor(Math.random() * letters.length)];
    }

    // Hash generated password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      12
    );

    // Update password
    existingUser.password = hashedPassword;
    await existingUser.save();

    return res.status(200).json({
      message: "Password reset successful",
      generatedPassword: newPassword,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
 