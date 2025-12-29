import Recipe from "../src/models/Recipe.js";
import connectDB from "../src/config/db.js";
import dotenv from "dotenv";
dotenv.config();

await connectDB();

const images = [
  ""
,
  "https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg",
  "https://images.pexels.com/photos/6544226/pexels-photo-6544226.jpeg",
  "https://tse3.mm.bing.net/th/id/OIP.cJjS2ELPFLglbm3YZyfLsQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://images.pexels.com/photos/29631489/pexels-photo-29631489.jpeg",
"https://th.bing.com/th/id/OIP.SEqZ0XA4QfEL7kakyUiv0AHaE8?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
"https://images.pexels.com/photos/20270270/pexels-photo-20270270.jpeg",
"https://images.pexels.com/photos/4001867/pexels-photo-4001867.jpeg",
"https://images.pexels.com/photos/4021879/pexels-photo-4021879.jpeg",
 "https://tastedrecipes.com/wp-content/uploads/2021/02/Veg-Upma-2.jpg"
];

const recipes = await Recipe.find();

for (let i = 0; i < recipes.length; i++) {
  recipes[i].imageUrl = images[i % images.length];
  await recipes[i].save();
}

console.log("Images updated!");
process.exit();
