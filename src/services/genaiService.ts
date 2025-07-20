import prisma from "../config/db.config";
import ai from "../config/gemini";

export const generateContext = async (repoData: any) => {
  const pageContent = repoData.pagecontent
    ? JSON.stringify(repoData.pagecontent).slice(0, 150)
    : "No code content available.";
  const fileName = repoData?.metadata?.source || "unknown file";

  const prompt = `You are an intelligent Senior Software Engineer who specializes in analyzing and summarizing software projects.
You have been provided with a repository data that contains metadata and page content.
You are onboarding a junior software engineer and explaining them the purpose of the ${fileName} file.
Here is the code:
${pageContent}.
Analyze the project data and generate a concise summary of the project not more than 100 words.
`;

  const context = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  console.log("Generated context:", context.text);
  return context.text;
};
export const generateReadmeCode = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const allContexts = await prisma.sourceCodeContext.findMany({
    where: { projectId: project.id },
    select: { context: true, file_name: true },
  });
  const aggregatedContexts = allContexts
    .map((context) => context.context)
    .join("\n\n");
  const readme = await generateReadme(aggregatedContexts);
  // console.log("Generated README content:", readme);
  return readme;
};
export const generateReadme = async (aggregatedContexts: string) => {
  const prompt = `
You are an experienced open-source technical writer.
Based on the following project file contexts, generate a high-quality, professional \`README.md\` for 
${aggregatedContexts}
---

📝 Include:
- Project Title and Description
- Features
- Setup Instructions
- CLI Commands (if applicable)
- Tech Stack
- Folder Structure (if inferrable)
- Contributing section
- License (just say "MIT License" if not found)

Format the README in clean, readable markdown. Only output the final README content.Dont add any additional text or comments.Only the code block with the markdown content is required. Do not include any other text or comments.
`;
  const readmeContent = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return readmeContent.text;
};
export const generateEmbeddings = async (summary: string) => {
  const embeddings = await Promise.all(
    [summary].map(async (text) => {
      const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
      });
      return response.embeddings;
    })
  );
  // console.log("Generated embeddings:", embeddings[0]?.values);
  // if (embeddings.length === 0 || !Array.isArray(embeddings[0]?.values)) {
  //   throw new Error("No embeddings generated");
  // }
  if (!embeddings[0] || !embeddings[0][0]) {
    throw new Error("No embeddings generated");
  }
  return embeddings[0][0].values;
};
