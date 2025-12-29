import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Prosty endpoint testowy
app.get("/", (req, res) => {
  res.json({ message: "AGH Marketplace Backend działa! 🚀" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
