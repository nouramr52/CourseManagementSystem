/**
 * authFactory.js — Factory Pattern for authentication responses
 *
 * Problem: loginUser, registerUser, googleAuthUser, and completeUserProfile
 * all build the same { user, token } response shape. That's duplication.
 *
 * Solution: a factory function that takes a User record and produces the
 * standardised response. One place to change the shape, expiry, or fields.
 *
 * This satisfies:
 *  - Factory Pattern: centralises object creation
 *  - DRY: token signing and user-object shaping happen in one place
 *  - Open/Closed: change the response shape here without touching services
 */

import jwt from "jsonwebtoken";

/**
 * Build the standard auth response returned to the client.
 *
 * @param {object} user  Prisma User record
 * @returns {{ user: object, token: string }}
 */
export const createAuthResponse = (user) => {
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }   // tokens expire after 7 days
    );

    return {
        user: {
            id:        user.id,
            name:      user.name,
            email:     user.email,
            role:      user.role,
            createdAt: user.createdAt,
        },
        token,
    };
};
