import { User } from "../models/user.js";
export const newUser = async (req, res, next) => {
    try {
        const { name, email, photo, gender, role, _id, dob } = req.body;
        await User.create({
            name, email, photo, gender, role, _id, dob
        });
        return res.status(200).json({
            sucess: true,
            message: `Welcome,${User.name}`,
        });
    }
    catch (error) {
    }
};
