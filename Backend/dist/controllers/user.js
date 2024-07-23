import { User } from "../models/user.js";
export const newUser = async (req, res, next) => {
    try {
        const { name, email, photo, gender, _id, dob } = req.body;
        console.log(name, email, photo, gender, _id, dob);
        const user = await User.create({
            name, email, photo, gender, _id, dob: new Date(dob)
        });
        return res.status(200).json({
            sucess: true,
            message: `Welcome,${user.name}`,
        });
    }
    catch (error) {
        return res.status(200).json({
            sucess: false,
            message: error,
        });
    }
};
