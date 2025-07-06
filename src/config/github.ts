import { Octokit } from "octokit";
import dotenv from "dotenv";
dotenv.config();
const github = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export default github;