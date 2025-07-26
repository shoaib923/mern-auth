import userModel from "../models/userModel.js";
import { errorResponse, successResponse } from "../utils/errorHandler.js";

export const getUserData = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return errorResponse(res, "User not found");
    }

    return successResponse(res, {
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified
      }
    });

  } catch (error) {
    return errorResponse(res, error.message);
  }
};

