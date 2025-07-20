import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;
if (!apiKey) {
  throw new Error("PINECONE_API_KEY environment variable is not set.");
}
export const pc = new Pinecone({
  apiKey,
});
const indexName = process.env.PINECONE_INDEX_NAME;
const host = process.env.PINECONE_HOST 
if (!host) {
  throw new Error("PINECONE_HOST environment variable is not set.");
}
if (!indexName) {
  throw new Error("PINECONE_INDEX_NAME environment variable is not set.");
}
export const index = pc.index(indexName, host);
