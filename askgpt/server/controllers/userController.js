import Chat from "../models/Chat.js";
import User from "../models/User";
import jwt from 'jsonwebtoken'

//to generate the token
const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '60d'
    })
}


//api to register the user 
export const registerUser = async (req, res) => {
    const { name, email ,password } = req.body;

    try {
        const userExists = await User.findOne({email})

        if(userExists){
            return res.json({success: false, message: "User already exist"})
        }

        const user = await User.create({name, email, password})

        const token = generateToken(user._id)
        res.json({success: true})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

//api to login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email})

        if(userExists){
             const isMatch = await bcrypt.compare(password, user.password)

             if(isMatch){
                const token = generateToken(user._id);
                return res.json({success: true, token })
             }
        }
        return res.json({ success: false, message: "Invalid email or password"})
    } catch (error) {
        return res.json({success: false, message: error.message })
    }
}

//api to get user data
export const getUser = async (req, res) => {
    try{
        const user = req.user;
        return res.json({ success: true, user })
    } catch (error){
        return res.json({ success: false, message: error.message })
    }
}

//api to get published images
export const getPublishedImages = async (req, res) => {
    try {
        const  publishedImageMessages = await Chat.aggregate([
            {$unwind: "$messages"},
            {
                $match: {
                    "message.isImage": true,
                    "message.isPublished": true
                }
            },
            {
                $project: {
                    _id: 0,
                    imageUrl: "$message.content",
                    userName: "$userName"
                }
            }
        ])
        res.json({success: true, images: publishedImageMessages.reverse()})
    } catch (error) {
        res.json({success: false, message: error.message })
    }
}