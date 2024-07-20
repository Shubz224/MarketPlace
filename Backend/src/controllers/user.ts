import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.js";

export const newUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { } = req.body;
        await User.create({

        })
        return res.status(200).json({
            sucess: true,
            message: `Welcome,${User.name}`,
        });
    } catch (error) {

    }
};