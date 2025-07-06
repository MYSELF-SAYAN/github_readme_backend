import github from "../config/github";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
export const loadGithubRepo = async (repoUrl: string, token?: string) => {
  const loader = new GithubRepoLoader(repoUrl, {
    accessToken: token || process.env.GITHUB_TOKEN,
    branch: "main",
    recursive: true,
    ignoreFiles: [
      "**/README.md",
      "**/LICENSE",
      "**/CONTRIBUTING.md",
      "**/.lock.json",
      "**/.lock.yaml",
      "**/.lock.yml",
    ],
    maxConcurrency: 5,
    unknown: "warn",
  });
  return await loader.load();
};

