import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: 'User already exists'});  
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(201).json({token, user: {id: newUser._id, name, email}});
    }
    catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({email});
        if(!existingUser) {
            return res.status(404).json({message: 'User does not exist'});
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({message: 'Invalid credentials'});
        }
        
        const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({token, user: {id: existingUser._id, name: existingUser.name, email: existingUser.email}});
    }
    catch (error) {
        res.status(500).json({message: "server error", error: error.message});
    }
};

export const verify = async (req, res) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if(!token) {
        return res.status(401).json({success: false, message: "No token provided"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({success: true, user: decoded});
    } 
    catch (error) {
        return res.status(403).json({success: false, message: "Invalid token"});
    }
};

export const users = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } 
    catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
};