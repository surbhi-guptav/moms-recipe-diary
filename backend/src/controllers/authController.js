import bcrypt  from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken"

export const register = async(req, res)=>{
    try{
        const {name, email, password} = req.body;
        const UserExists = await User.findOne({email});

        if (UserExists){
            return res.status(400).json(
                {
                    message: "User already exists"
                }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create(
            {
                name,
                email,
                password: hashedPassword
            }
        );

        res.status(201).json(
            {
                message: "User registered Successfully"
            }
        );

    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }
};

export const login = async (req, res) =>{
    try{

        const {email, password} = req.body;

        const user = await User.findOne({email});

        if (!user){
            return res.status(400).json(
                {
                    message: "Invalid credentials"
                }
            );
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if (!isCorrectPassword){
            return res.status(400).json(
                {
                    message: "Incorrect Password"
                }
            );
        }

        const token = jwt.sign(
            {id : user._id},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );

        res.json(
            {
                token,
                user:{
                    id: user._id,
                    name: user.name
                }
            }
        );
    }
    catch(err){
        return res.status(500).json(
            {
                message: err.message
            }
        );
    }
};

