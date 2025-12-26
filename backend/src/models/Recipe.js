import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true
        },

        ingredients: {
            type:[String],
            required: true
        },
        steps:{
            type:[String],
            required:true
        },
        memoryNote:{
            type: String 
        },
        imageUrl: {
            type: String
        },
        category:{
            type:String,
            enum:["Mom's Special", "Traditional", "Festival", "Daily"],
            default: "Traditional"
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        comments: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            text: String,
            createdAt: { type: Date, default: Date.now }
        }]
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Recipe", recipeSchema);