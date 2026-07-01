import { getAuth } from "@clerk/express";
import User from "../models/User.model.js";

export const requireAuth = async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId: auth.userId });

    if (!user) {
      return res.status(401).json({ error: "User not registered" });
    }

    req.auth = auth;
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};
