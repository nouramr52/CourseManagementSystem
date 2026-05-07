import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../repositories/userRepos.js";

export const registerUser = async (data) => {
    const { name, email, password } = data;
    const role = data.role?.toUpperCase();

    const existingUser = await findUserByEmail(email);
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({ name, email, password: hashedPassword, role });

    const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRET
    );

    return {
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
        token
    };
};

export const loginUser = async ({ email, password }) => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
};
