import { Request, Response, RequestHandler } from "express";
import prisma from "../config/db.config";
import { generateEmbeddings } from "../services/genaiService";
export const chatWithAI: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId, question } = req.body;
  const embeddedQuestion = await generateEmbeddings(question);
  const vectorQuery = `[${embeddedQuestion?.join(",")}]`;
  const result = (await prisma.$queryRaw`
    select "file_name", "source_code","context", 1 - ("embedding" <=> ${vectorQuery}::vector) as similarity
    from "SourceCodeContext"
    where 1-("embedding" <=> ${vectorQuery}::vector) > .5
    and "projectId" = ${projectId}
    order by similarity desc
    limit 10;
    `) as {
    file_name: string;
    source_code: string;
    context: string;
    similarity: number;
  }[];
  let context = "";
  for (const item of result) {
    context += `File: ${item.file_name}\n\nContext: ${item.context}\n\nSource Code:\n${item.source_code}\n\n`;
  }
  res.status(200).json({
    message: "Context retrieved successfully",
    context: context,
    results: result,
  });
};
