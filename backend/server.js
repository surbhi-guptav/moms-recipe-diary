import app from "./src/app.js"
import connectDB from "./src/config/db.js"
import dotenv from "dotenv"

dotenv.config();
console.log("DEBUG MONGO_URI:", process.env.MONGO_URI); 
console.log("DEBUG port:", process.env.port);  

connectDB();

const port = process.env.port || 5000;

app.listen(
    port,
    ()=> {
        console.log(`Server running on port ${port}`)
    }
);