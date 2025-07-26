// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import {
  welcomeEmailTemplate,
  otpEmailTemplate,
  resetPasswordEmailTemplate,
} from "../utils/emailTemplates.js";
import { generateOtp, sendEmail } from "../utils/emailUtils.js";
import {
  errorResponse,
  successResponse,
} from "../utils/errorHandler.js";
import {
  validateRegister,
  validateLogin,
  validateOtpRequest,
  validateResetOtpRequest,
  validateVerifyEmail,
  validateResetPassword,
} from "../utils/validators.js";

const websiteUrl = process.env.WEBSITE_URL || "https://www.youtube.com";

const setTokenCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    const validationError = validateResetOtpRequest({ email });
    if (validationError) {
      return errorResponse(res, validationError);
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, "User not found");
    }

    // Verify OTP
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return errorResponse(res, "Invalid OTP");
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return errorResponse(res, "OTP expired");
    }

    return successResponse(res, "OTP verified successfully");
  } catch (error) {
    console.error("Error in verifyResetOtp:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    const validationError = validateRegister({ name, email, password });
    if (validationError) {
      return errorResponse(res, validationError);
    }

    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "User Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    // Set token cookie
    setTokenCookie(res, user._id);

    // Send welcome email
    await sendEmail({
      to: email,
      subject: "🎉 Welcome to Our Community!",
      html: welcomeEmailTemplate(email, websiteUrl),
      text: `Welcome to our website! Your account has been created with email: ${email}. Visit ${websiteUrl} to explore. Thank you for joining us!`,
    });

    return successResponse(res, "Registration successful");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validationError = validateLogin({ email, password });
    if (validationError) {
      return errorResponse(res, validationError);
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, "Invalid email");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, "Invalid password");
    }

    // Set token cookie
    setTokenCookie(res, user._id);

    return successResponse(res, "Login successful");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return successResponse(res, "Logged out successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId; // Use req.userId from userAuth middleware

    // Validate input
    const validationError = validateOtpRequest({ userId });
    if (validationError) {
      return errorResponse(res, validationError);
    }

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return errorResponse(res, "User not found");
    }

    if (user.isAccountVerified) {
      return errorResponse(res, "Account already verified");
    }

    // Generate and save OTP
    const otp = generateOtp();
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send OTP email
    await sendEmail({
      to: user.email,
      subject: "Account Verification OTP",
      html: otpEmailTemplate(otp, websiteUrl),
      text: `Your OTP is ${otp}. It is valid for 24 hours. Visit ${websiteUrl}/verify to complete verification.`,
    });

    return successResponse(res, "Verification OTP sent to email");
  } catch (error) {
    console.error("Error in sendVerifyOtp:", error); // Log error for debugging
    return errorResponse(res, error.message, 500);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
  const userId = req.userId;


    // Validate input
    const validationError = validateVerifyEmail({ userId, otp });
    if (validationError) {
      return errorResponse(res, validationError);
    }

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return errorResponse(res, "User not found");
    }

    // Verify OTP
    if (user.verifyOtp !== otp || user.verifyOtp === "") {
      return errorResponse(res, "Invalid OTP");
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return errorResponse(res, "OTP expired");
    }

    // Update user
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = null;
    await user.save();

    return successResponse(res, "Email verified successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return errorResponse(res, "No token provided", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return errorResponse(res, "User not found", 401);
    }

    return successResponse(res, "Authenticated", { user });
  } catch (error) {
    return errorResponse(res, "Invalid token", 401);
  }
};

export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    const validationError = validateResetOtpRequest({ email });
    if (validationError) {
      return errorResponse(res, validationError);
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, "User not found");
    }

    // Generate and save OTP
    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send OTP email
    await sendEmail({
      to: user.email,
      subject: "Reset Password OTP",
      html: resetPasswordEmailTemplate(otp, websiteUrl),
      text: `Your OTP for password reset is ${otp}. It is valid for 15 minutes. Visit ${websiteUrl}/reset-password to proceed.`,
    });

    return successResponse(res, "Password reset OTP sent to email");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const resetPassword = async (req,res)=>{
    const {email,otp,newPassword} = req.body

    if(!email || !otp || !newPassword){
        return res.json({
            success: false,
            message: "Email, OTP, and new password are required."
        }) 
    }

    try {

        const user = await userModel.findOne({email})
        if(!user){
            return res.json({
            success: false,
            message: "User not Found"
        }) 
        }

        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({
            success: false,
            message: "Invalid OTP"
        }) 
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({
            success: false,
            message: "OTP Expired"
        }) 
        }

        const hashedPassword = await bcrypt.hash(newPassword,10)

        user.password = hashedPassword
        user.resetOtp= ''
        user.resetOtpExpireAt = 0

        await user.save()

        return res.json({
            success: true,
            message: "Password has been reset successfully!"
        }) 
        
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        }) 
    }
}