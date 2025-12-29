// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import fs from "fs";
// import Recipe from "../src/models/Recipe.js";
// import connectDB from "../src/config/db.js";

// dotenv.config();
// await connectDB();

// const data = JSON.parse(fs.readFileSync("./seed/recipes.json", "utf-8"));

// await Recipe.deleteMany();
// await Recipe.insertMany(data);

// console.log("🌱 Seeded recipes successfully!");
// process.exit();



// import dotenv from "dotenv";
// dotenv.config();

// import connectDB from "../src/config/db.js";
// import Recipe from "../src/models/Recipe.js";
// import User from "../src/models/User.js";

// await connectDB();

// const users = await User.find().limit(10); // take first 10 users
// const userIds = users.map(u => u._id);

// const recipes = await Recipe.find();

// for (const recipe of recipes) {
//   recipe.likes = userIds.slice(0, Math.floor(Math.random() * userIds.length) + 1);
//   await recipe.save();
// }

// console.log("Likes added using real users!");
// process.exit();



import mongoose from "mongoose";
import dotenv from "dotenv";
import Recipe from "../src/models/Recipe.js";
import connectDB from "../src/config/db.js";

dotenv.config();
await connectDB();

const myUserId = "694bf07107d67540b5643710";

const myRecipeIds = [
  "694e9a3276a139ece96faf6c",
  "694e9a3276a139ece96faf66",
  "694e9a3276a139ece96faf67",
  "694e9a3276a139ece96faf71",
  "694e9a3276a139ece96faf6b",
  "694e9a3276a139ece96faf70"
];

await Recipe.updateMany(
  { _id: { $in: myRecipeIds } },
  { $set: { createdBy: myUserId } }
);

console.log("Assigned selected recipes to your user!");
process.exit();

