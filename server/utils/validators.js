// utils/validators.js
export const validateRegister = ({ name, email, password }) => {
  if (!name || !email || !password) {
    return "Name, email, and password are required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email format";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
};

export const validateLogin = ({ email, password }) => {
  if (!email || !password) {
    return "Email and password are required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email format";
  }
  return null;
};

export const validateOtpRequest = ({ userId }) => {
  if (!userId) {
    return "User ID is required";
  }
  return null;
};

export const validateResetOtpRequest = ({ email }) => {
  if (!email) {
    return "Email is required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email format";
  }
  return null;
};

export const validateVerifyEmail = ({ userId, otp }) => {
  if (!userId || !otp) {
    return "User ID and OTP are required";
  }
  return null;
};
export const validateResetPassword=({email,otp,newPassword})=>{
    if(!email ||!otp ||!newPassword){
        return "Email, OTP, and new password are required";
    }
    return null;
}