"use strict"

import pkg from 'jsonwebtoken'
import dotenv from 'dotenv'
import { StatusCodes } from "http-status-codes";
import Authentication from '../modals/auth.modals.js';

dotenv.config();
const { sign } = pkg


//Login by User
export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    try {
        const check = await Authentication.login(email, password)

        //throw 401
        if (check[0].count != 1) {
            res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
            return false;
        }

        //token generation
        const token = sign({ userId: email, role: check[0].User_Type }, process.env.JWT_SECRET_KEY, {
            // expiresIn: "1h"
        });
        res.status(StatusCodes.OK).json({ token: token, userId: check[0].User_ID, UserType: check[0].User_Type });
    } catch (error) {
        console.log(error);
    }
};

//Sign up User
export const createUser = async (req, res) => {
    const { name, email, password, phoneNumber, gender } = req.body
    try {
        const insert = await Authentication.addUser(name, email, password, phoneNumber, gender)

        if (insert.result.affectedRows === 1) {


            //token generation
            const token = sign({ name: name, userId: insert.userId }, process.env.JWT_SECRET_KEY, {
                // expiresIn: "1h"
            });

            res.status(StatusCodes.CREATED).json({ message: "User Created", userId: insert.userId, token: token })
        }
    } catch (error) {
        res.status(StatusCodes.CONFLICT).json({ message: error.message })
    }

}
