import * as mongoCollections from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const userCollection = await mongoCollections.user();

// Function to create a new reminder for a user
const createReminder = async (userId, medicationName, time) => {
    if (!userId || !ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
    }

    if (!medicationName || typeof medicationName !== 'string' || medicationName.trim() === '') {
        throw new Error('Medication name must be a non-empty string');
    }

    if (!time || typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time.trim())) {
        throw new Error('Time must be in HH:MM 24-hour format');
    }

    const today = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const reminderDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);

    const reminder = {
        _id: new ObjectId(),
        medicine: medicationName.trim(),
        reminderTime: reminderDate
    };

    const updateInfo = await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { reminders: reminder } }
    );

    if (updateInfo.modifiedCount === 0) {
        throw new Error('Failed to add reminder to user');
    }

    return reminder;
};

// Function to remove a reminder
const removeReminder = async (userId, reminderId) => {
    if (!userId || !ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
    }

    if (!reminderId || !ObjectId.isValid(reminderId)) {
        throw new Error('Invalid reminder ID');
    }

    const updateInfo = await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { reminders: { _id: new ObjectId(reminderId) } } }
    );

    if (updateInfo.modifiedCount === 0) {
        throw new Error('Failed to remove reminder or reminder not found');
    }

    return { message: 'Reminder successfully removed' };
};

// Check if any reminders match current time for a specific user
const checkReminders = async (userId) => {
    if (!userId || !ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
    }

    const today = new Date();
    const estTime = new Date(today.getTime() + today.getTimezoneOffset() * 60000);
    const utcDate = new Date(estTime);
    utcDate.setHours(estTime.getHours() + 5);

    const user = await userCollection.findOne(
        { 
            _id: new ObjectId(userId),
            'reminders.reminderTime': {
                $gte: utcDate,
                $lt: new Date(utcDate.getTime() + 60000)
            }
        }
    );

    if (user && user.reminders) {
        const currentReminders = user.reminders.filter(reminder => {
            const reminderTime = new Date(reminder.reminderTime);
            return reminderTime >= utcDate && reminderTime < new Date(utcDate.getTime() + 60000);
        });

        if (currentReminders.length > 0) {
            currentReminders.forEach(reminder => {
                console.log(`Reminder for ${user.firstName}: Time to take ${reminder.medicine} now!`);
            });
            return currentReminders;
        }
    }
    
    console.log('No reminders at this time.');
    return [];
};

export {
    createReminder,
    removeReminder,
    checkReminders
};