const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const myError = require("../lib/myError");

/**
 * Middleware to authenticate a user using JWT token.
 * 1. Gets token from req.headers
 * 2. Verifies token and checks for expiry
 * 3. If valid, decodes the token and populates req.user
 * 4. If invalid, returns an error response.
 */
const requireAuth = asyncHandler(async (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) {
        throw new myError("Auth headers missing", 401); // Missing Authorization header
    }

    const token = auth.split(" ")[1]; // Get the token from "Bearer <token>"

    try {
        // Verify the token and decode it asynchronously
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    reject(new myError(err.name, 401)); // Token verification failed
                } else {
                    resolve(decoded); // Token successfully verified
                }
            });
        });

        // Now we have the decoded user data (e.g., user ID)
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            throw new myError("User not found", 404); // User does not exist
        }

        // Attach the user to the request object
        req.user = user;
        console.log("=== Required auth gained ===", req.user.id);
        next(); // Proceed to the next middleware or route handler

    } catch (err) {
        next(err); // Handle errors (JWT verification, user not found, etc.)
    }
});

module.exports = requireAuth;
