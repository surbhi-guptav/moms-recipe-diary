import cors from "cors"
import express from "express"
import authRoutes from "./routes/authRoutes.js"
import recipeRoutes from "./routes/recipeRoutes.js"

const app = express();

import cors from "cors";

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://moms-recipe-diary.netlify.app/"
  ],
  credentials: true
}));


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Mom's Recipe Diary API is running ❤️");
});

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);


export default app;