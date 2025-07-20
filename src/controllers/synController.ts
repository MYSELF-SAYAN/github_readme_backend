import { Request, Response, RequestHandler } from "express";
import prisma from "../config/db.config";

const syncUserData: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, username, email, firstName, lastName, imageUrl } = req.body;
  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }
  try {
    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: email,
        username: username,
        firstName: firstName,
        lastName: lastName,
        imageUrl: imageUrl,
      },
      update: {
        email: email,
        username: username,
        firstName: firstName,
        lastName: lastName,
        imageUrl: imageUrl,
      },
    });

    res.status(200).json({ message: "User data synced successfully" });
  } catch (error) {
    console.error("Error syncing user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { syncUserData };
