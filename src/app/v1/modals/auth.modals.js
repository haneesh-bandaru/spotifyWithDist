import { poolPromise } from "../utils/dbConnection.js";
import { v1 as uuidv1 } from "uuid";


const pool = await poolPromise

class Authentication {
    //method to sign up 
    static async addUser(name, emailId, password, phoneNumber, gender) {
        let userId = uuidv1();
        try {
            const [result] = await pool.query(`INSERT INTO Users (User_ID,Name, Email, Password, Phone_Number,Gender) VALUES (?,?,?,?,?,?)`, [userId, name, emailId, password, phoneNumber, gender])
            return { result, userId };
        } catch (err) {
            throw err;
        }
        finally {
            // pool.close()
        }
    }

    //method to login 
    static async login(email, password) {
        try {
            const [result] = await pool.query(`select count(*) as count,User_Type,User_ID from users where email = ? and password = ?`, [email, password]);
            return result;
        } catch (err) {
            throw err;
        }
    }

}

export default Authentication