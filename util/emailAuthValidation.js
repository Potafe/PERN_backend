const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const myError = require("../lib/myError");

const prisma = new PrismaClient();

/* 
-> displayName
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

async function emailSignupValidation(displayName, email, password) {
    // Ensure email is unique
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) throw new myError("Username has already been taken", 409); // Conflict
    else {
        try {
            const user = await prisma.user.create({
                data: {
                    displayName,
                    email,
                    password: encryptPassword(password),
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
