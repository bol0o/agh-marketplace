import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// SECURITY CHECK
if (!process.env.JWT_SECRET) {
  throw new Error("ERROR: JWT_SECRET is missing");
}

const JWT_SECRET: string = process.env.JWT_SECRET;

//Extend request object to include userId and role
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

//Interface for the decoded token payload to avoid any type
interface TokenPayload {
  userId?: string;
  userid?: string;
  id?: string;
  sub?: string;
  role?: string;
  [key: string]: any;
}

//Authentication middleware
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  //Get token from headers
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Brak tokena uwierzytelniającego" });
    return;
  }

  //Verify token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      res.status(403).json({ error: "Token jest nieprawidłowy lub wygasł" });
      return;
    }

    //Cast decoded payload to our interface
    const payload = decoded as TokenPayload;

    console.log("Decoded token payload:", payload);

    //Check for userId in various formats (userId, userid, id, sub)
    const extractedId =
      payload.userId || payload.userid || payload.id || payload.sub;

    if (!extractedId) {
      console.error("Token missing user ID field");
      res.status(403).json({ error: "Token nie zawiera ID użytkownika" });
      return;
    }

    //Attach user info to request object
    req.user = {
      userId: extractedId,
      role: payload.role || "STUDENT",
    };

    next();
  });
};
