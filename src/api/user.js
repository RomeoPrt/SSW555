import * as mongoCollections from '../../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
const usersCollection = await mongoCollections.users();

const createUser = async (email, password, firstName, lastName, age) => {
    if (typeof email !== 'string' || typeof password !== 'string' ||
        typeof firstName !== 'string' || typeof lastName !== 'string') {
      throw 'Email, password, firstName, and lastName must all be strings';
    }
    
    if (typeof age !== 'number' || age <= 0) {
      throw 'Age must be a positive number';
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw 'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character';
    }

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) throw 'User already exists'
  
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        email:email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        age,
    };
  
    const userInformation = await usersCollection.insertOne(user);
    if (!userInformation.insertedId) throw 'Error: Insert failed!'
    return user
}
  
const getUser = async (email, password) => {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) 'Invalid password'

    const user = await usersCollection.findOne({ email });
    if (!user) throw 'User not found';

    const { password: userPassword, _id: id, ...userInfo } = user;
    return userInfo
}
  
  