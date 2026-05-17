/**
 * createUser.js — DTO / input validation for user registration
 *
 * Interface Segregation Principle: each DTO validates only the fields
 * relevant to its specific operation.
 *
 * Open/Closed Principle: add new validation rules here without touching
 * the controller or service.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ROLES = ["STUDENT", "INSTRUCTOR"];

/**
 * Validate and sanitise the body of a POST /api/auth/signup request.
 *
 * @param {object} body  Raw request body
 * @returns {{ name: string, email: string, password: string, role: string }}
 * @throws {Error} with a descriptive message if validation fails
 */
export const validateCreateUser = (body) => {
    const { name, email, password, role } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
        throw new Error("Name must be at least 2 characters");
    }

    if (!email || !EMAIL_REGEX.test(email)) {
        throw new Error("A valid email address is required");
    }

    if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    const normalizedRole = role?.toUpperCase() ?? "STUDENT";
    if (!ALLOWED_ROLES.includes(normalizedRole)) {
        throw new Error(`Role must be one of: ${ALLOWED_ROLES.join(", ")}`);
    }

    return {
        name:     name.trim(),
        email:    email.toLowerCase().trim(),
        password,
        role:     normalizedRole,
    };
};
