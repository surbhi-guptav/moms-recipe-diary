import jwt from "jsonwebtoken"

const auth= (req, res, next)=>{
    const token = req.headers.authorization?.split(" ")[1];

    if (!token){
        return res.status(401).json(
            {
                message: "No token, authorization denied"
            }
        );
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode.id;
        next();
    }
    catch(err){
        return res.status(500).json(
            {
                message: "Token is not valid"
            }
        );
    }
}

export default auth;