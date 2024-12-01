import bcrypt from 'bcrypt'
import * as mongoCollections from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const userCollections = await mongoCollections.user();


const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return strongPasswordRegex.test(password);
};
  
const registerUser = async (firstName, lastName, age, email, password) => {
    if (typeof firstName !== 'string' || typeof lastName !== 'string') throw 'First and last name must be strings'
    if (typeof age !== 'number' || age <= 0) throw 'Age must be a positive number'
    if (!isValidEmail(email)) throw 'Invalid email format'
    if (!isStrongPassword(password)) throw 'Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character'

    const existingUser = await userCollections.findOne({ email });
    if (existingUser) throw 'Email is already in use'

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        _id: new ObjectId(),
        firstName:firstName,
        lastName:lastName,
        age:age,
        email:email,
        password: hashedPassword,
        medicine: [], 
        reminders: []
    }

    const newUserinfo = await userCollections.insertOne(user);
    if (!newUserinfo.insertedId) throw 'Error: Insert failed!'
    return user
}

const loginUser = async (email, password) => {
    if (!isValidEmail(email)) throw 'Invalid email format'
    if (typeof password !== 'string') throw 'Password must be a string'

    const user = await userCollections.findOne({ email });
    if (!user) throw 'User not found'

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw 'Incorrect password'

    console.log('User logged in successfully');
    return user;
}


export { registerUser, loginUser }