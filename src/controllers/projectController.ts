import { Request, Response, RequestHandler } from "express";
import { loadGithubRepo } from "../services/githubService";
import prisma from "../config/db.config";
import dotenv from "dotenv";
import {
  generateContext,
  generateEmbeddings,
  generateReadmeCode,
} from "../services/genaiService";
dotenv.config();
export const createProject: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { repoUrl, name, token, userId } = req.body;

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
      userId: userId, // Assuming userId is passed correctly in req.body
    },
  });
  for (const doc of repoData) {
    const context = await generateContext(doc);
    const embedding = await generateEmbeddings(
      context || "No context generated"
    );
    const contextId = await prisma.sourceCodeContext.create({
      data: {
        context: context || "No context generated",
        source_code: doc.pageContent,
        file_name: doc.metadata?.source || "Unknown",
        projectId: getProjectId?.id,
      },
    });
    await prisma.$executeRaw`
    update "SourceCodeContext"
    set embedding = ${embedding}::vector
    where id = ${contextId.id}
    `;
  }

  res.status(200).send({ message: "Repository data saved successfully." });
};
export const getProjects: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.body; // Assuming userId is passed in the request body
  if (!userId) {
    res.status(400).send({ error: "User ID is required." });
    return;
  }

  try {
    const projects = await prisma.project.findMany({
      where: { userId: userId },
      include: { sourceCodeContexts: true },
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).send({ error: "Failed to fetch projects." });
  }
};
