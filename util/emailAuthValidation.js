const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const myError = require("../lib/myError");

const prisma = new PrismaClient();

/* 
-> username
-> email 
-> password
*/

async function emailLoginValidation(email, password) {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
            throw new myError("Password or Email is incorrect", 401);
        }
        return user;
    } catch (err) {
        console.log("ERR: email login validation");
        console.log(err);
        throw err; // Rethrow error to handle it at the caller level
    }
}

async function emailSignupValidation(username, email, password) {
    // Ensure email is unique
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) throw new myError("Email has already been taken", 409); // Conflict
    else {
        try {
            // Encrypt the password
            const hashedPassword = encryptPassword(password);

            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    hashedPassword, // Use `hashedPassword` instead of `password`
                },
            });

            console.log("= New user created", user);
            return user;
        } catch (err) {
            console.log("ERR: email signup validation");
            console.log(err);
            throw err; // Rethrow error to handle it at the caller level
        }
    }
}

function encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10); // Random salt
    return bcrypt.hashSync(password, salt);
}

module.exports = {
    emailLoginValidation,
    emailSignupValidation,
};
