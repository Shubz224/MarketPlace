import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.js";
import { NewUserrequestBody } from "../types/types.js";

export const newUser = async (req: Request<{}, {}, NewUserrequestBody>, res: Response, next: NextFunction) => {

    try {
        const { name, email, photo, gender,  _id, dob } = req.body;
     
        console.log( name, email, photo, gender,  _id, dob);
        
      const user =   await User.create({
            name, email, photo, gender, _id, dob
        })
        return res.status(200).json({
            sucess: true,
            message: `Welcome,${user.name}`,
        });
    } catch (error) {
        return res.status(200).json({
            sucess: false,
            message: error,
        })
    }
};