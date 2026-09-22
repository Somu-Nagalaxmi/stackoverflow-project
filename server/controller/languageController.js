import crypto from "crypto";
import user from "../models/auth.js";
import LanguageVerification from "../models/languageVerification.js";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};


// ================= SEND OTP =================

export const sendLanguageOTP = async (req, res) => {
  try {
    const { language } = req.body;

    if (!["en", "es", "hi", "pt", "zh", "fr"].includes(language)) {
      return res.status(400).json({
        message: "Unsupported language",
      });
    }

    const userid = req.userid;

    const existingUser = await user.findById(userid);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // French -> Email
    // Other languages -> Mobile
    const verificationMethod =
      language === "fr" ? "email" : "phone";

    if (verificationMethod === "email" && !existingUser.email) {
      return res.status(400).json({
        message: "Registered email not available",
      });
    }

    if (verificationMethod === "phone" && !existingUser.phone) {
      return res.status(400).json({
        message: "Registered mobile number not available",
      });
    }

    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    await LanguageVerification.deleteMany({
      userid,
      language,
      verified: false,
    });

    await LanguageVerification.create({
      userid,
      language,
      verificationMethod,
      otp: hashedOTP,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    /*
      REAL EMAIL/SMS SERVICE HERE

      French:
      Send OTP to existingUser.email

      Other languages:
      Send OTP to existingUser.phone

      For development/testing:
      OTP is returned only when NODE_ENV is not production.
    */

    const response = {
      message: `OTP sent to registered ${verificationMethod}`,
      verificationMethod,
    };

    if (process.env.NODE_ENV !== "production") {
      response.devOtp = otp;
    }

    res.status(200).json(response);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to send language OTP",
    });
  }
};


// ================= VERIFY OTP =================

export const verifyLanguageOTP = async (req, res) => {
  try {
    const { language, otp } = req.body;

    if (!language || !otp) {
      return res.status(400).json({
        message: "Language and OTP are required",
      });
    }

    const userid = req.userid;

    const verification = await LanguageVerification.findOne({
      userid,
      language,
      verified: false,
    }).sort({ createdAt: -1 });

    if (!verification) {
      return res.status(400).json({
        message: "OTP not found. Please request a new OTP",
      });
    }

    if (new Date() > verification.expiresAt) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const hashedOTP = hashOTP(otp);

    if (hashedOTP !== verification.otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    verification.verified = true;
    await verification.save();

    // Save preferred language
    await user.findByIdAndUpdate(userid, {
      language,
    });

    res.status(200).json({
      message: "Language changed successfully",
      language,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Language verification failed",
    });
  }
};