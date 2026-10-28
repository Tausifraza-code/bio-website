const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../models/User");
const ReferralLog = require("../models/ReferralLog");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const generateReferralCode = () => {
  return `BIO-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, referralCode } = req.body;

    // 1. Validate required fields
    if (!fullName?.trim() || !email?.trim() || !phone?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, phone and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    // 2. Check existing email or phone
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.email === normalizedEmail
            ? "Email is already registered"
            : "Phone number is already registered",
      });
    }

    // 3. Validate referral code if provided
    let referrer = null;
    let normalizedReferralCode = "";

    if (referralCode?.trim()) {
      normalizedReferralCode = referralCode.trim().toUpperCase();

      referrer = await User.findOne({
        referralCode: normalizedReferralCode,
      });

      if (!referrer) {
        return res.status(400).json({
          success: false,
          message: "Invalid referral code",
        });
      }
    }

    // 4. Hash password in the controller
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Generate a unique referral code for the new user
    let newReferralCode;
    let codeExists = true;

    while (codeExists) {
      newReferralCode = generateReferralCode();

      codeExists = Boolean(
        await User.exists({ referralCode: newReferralCode }),
      );
    }

    // 6. Save user and referral log together when transactions are supported
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const [newUser] = await User.create(
          [
            {
              fullName: fullName.trim(),
              email: normalizedEmail,
              phone: normalizedPhone,
              password: hashedPassword,
              referralCode: newReferralCode,
              referredBy: referrer?._id || null,
            },
          ],
          { session },
        );

        if (referrer) {
          await ReferralLog.create(
            [
              {
                referrerId: referrer._id,
                referredUserId: newUser._id,
                referralCodeUsed: normalizedReferralCode,
              },
            ],
            { session },
          );
        }

        res.locals.registeredUser = newUser;
      });
    } finally {
      await session.endSession();
    }

    const newUser = res.locals.registeredUser;

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        referralCode: newUser.referralCode,
        referredBy: newUser.referredBy,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email, phone or referral code already exists. Please retry.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

const jwt = require("jsonwebtoken");

// Add this function to your existing auth.controller.js

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 1. Validate input
//     if (!email?.trim() || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     // 2. Find user and explicitly include password hash
//     const user = await User.findOne({
//       email: email.trim().toLowerCase(),
//     }).select("+password");

//     // 3. Verify credentials
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     // 4. Ensure JWT secret is configured
//     if (!process.env.JWT_SECRET) {
//       throw new Error("JWT_SECRET is missing from .env");
//     }

//     // 5. Generate JWT
//     const token = jwt.sign(
//       {
//         userId: user._id.toString(),
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" },
//     );

//     // 6. Return token and safe user details
//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         referralCode: user.referralCode,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Login failed due to a server error",
//     });
//   }
// };

const loginUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // 1. Validate input
    const loginEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    const loginPhone =
      typeof phone === "string" ? phone.replace(/\s+/g, "") : "";

    if ((!loginEmail && !loginPhone) || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number and password are required",
      });
    }

    // 2. Find user by email OR phone
    const userQuery = loginEmail
      ? { email: loginEmail }
      : { phone: loginPhone };

    const user = await User.findOne(userQuery).select("+password");

    // 3. Verify credentials
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/phone number or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/phone number or password",
      });
    }

    // 4. Ensure JWT secret is configured
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from .env");
    }

    // 5. Generate JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // 6. Return token and safe user details
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed due to a server error",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Same response whether the account exists or not
    const successMessage =
      "If an account exists for this email, a reset link will be sent.";

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: successMessage,
      });
    }

    if (
      !process.env.EMAIL_HOST ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS ||
      !process.env.EMAIL_FROM
    ) {
      throw new Error("Email configuration is missing");
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store only the token hash in the database
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires after 15 minutes
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 465),
      secure: Number(process.env.EMAIL_PORT || 465) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Reset your BIO Website password",
        text: `Use this link to reset your password: ${resetUrl}\nThis link expires in 15 minutes. If you did not request this, ignore this email.`,
        html: `
          <h2>Reset your password</h2>
          <p>Click below to choose a new password.</p>
          <p><a href="${resetUrl}">Reset Password</a></p>
          <p>This link expires in 15 minutes.</p>
          <p>If you did not request this, ignore this email.</p>
        `,
      });
    } catch (emailError) {
      // Invalidate the token if email delivery fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      throw emailError;
    }

    return res.status(200).json({
      success: true,
      message: successMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to process password reset right now",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash the token to match the database value
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires +password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired",
      });
    }

    // Hash the new password before saving
    user.password = await bcrypt.hash(newPassword, 12);

    // Make the reset token single-use
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please log in again.",
    });
  } catch (error) {
    console.error("Reset password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password right now",
    });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
      referralCode: req.user.referralCode,
    },
  });
};

const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  forgotPassword,
  resetPassword,
};
