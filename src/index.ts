import express from "express";
import createRoute from "./routes/index"; 
import cors from "cors";
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use("/v1", createRoute);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
