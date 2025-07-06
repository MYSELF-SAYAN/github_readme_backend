import { Request, Response, RequestHandler } from "express";
import { loadGithubRepo } from "../services/githubService";
import prisma from "../config/db.config";
import dotenv from "dotenv";
import { generateContext, generateReadmeCode } from "../services/genaiService";
dotenv.config();
export const createReadme: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { projectId } = req.params;
  if (!projectId) {
    res.status(400).send({ error: "Project ID is required." });
    return;
  }

  const readmeCode = await generateReadmeCode(projectId);
  if (!readmeCode) {
    res.status(500).send({ error: "Failed to generate README code." });
    return;
  }
  // console.log("Generated README code:", readmeCode);
  res.status(200).send({ message: "Readme code generated successfully.", readmeCode });
};
