import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authMiddleware = ({ req }: any = {}) => {

  if (!req || !req.headers) {
    return {}; 
  }
  const authHeader = req.headers.authorization || "";

  if (!authHeader) {
    return {}; 
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };

    return { userId: decoded.userId, email: decoded.email }; 
  } catch (error) {
    console.error("Invalid token:", error);
    return {}; 
  }
};
