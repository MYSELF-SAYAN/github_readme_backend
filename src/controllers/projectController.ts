import { Request, Response, RequestHandler } from "express";
import { loadGithubRepo } from "../services/githubService";
import prisma from "../config/db.config";
import dotenv from "dotenv";
import { generateContext, generateReadmeCode } from "../services/genaiService";
dotenv.config();
export const createProject: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { repoUrl, name, token } = req.body;

  if (!name || !repoUrl) {
    res.status(400).send({ error: "Name and repository URL are required." });
    return;
  }

  const repoData = await loadGithubRepo(repoUrl, token);
  if (!repoData || repoData.length === 0) {
    res
      .status(404)
      .send({ error: "Repository not found or no data available." });
    return;
  }
  const getProjectId = await prisma.project.create({
    data: {
      name: name,
      access_token: token || process.env.GITHUB_TOKEN,
      url: repoUrl,
    },
  });
  for (const doc of repoData) {
    const context = await generateContext(doc);
    await prisma.sourceCodeContext.create({
      data: {
        context: context || "No context generated",
        source_code: doc.pageContent,
        file_name: doc.metadata?.source || "Unknown",
        projectId: getProjectId?.id,
      },
    });
  }

  res.status(200).send({ message: "Repository data saved successfully." });
};
