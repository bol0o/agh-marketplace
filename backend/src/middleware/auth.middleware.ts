import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "key";

//Extend request object to include userId and role
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

//Authentication middleware
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  //Get token from headers
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Brak tokena uwierzytelniającego" });
  }

  //Verify token
  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res
        .status(403)
        .json({ error: "Token jest nieprawidłowy lub wygasł" });
    }

    console.log("Decoded token payload:", decoded);

    //Check for userId in various formats (userId, userid, id, sub)
    const extractedId =
      decoded.userId || decoded.userid || decoded.id || decoded.sub;

    if (!extractedId) {
      console.error("Token missing user ID field");
      return res
        .status(403)
        .json({ error: "Token nie zawiera ID użytkownika" });
    }

    req.user = {
      userId: extractedId,
      role: decoded.role || "STUDENT",
    };

    next();
  });
};
