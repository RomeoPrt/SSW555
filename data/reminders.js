import * as mongoCollections from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const medicineCollection = await mongoCollections.medicine();
const remindersCollection = await mongoCollections.reminder();


// Function to create a new reminder
const createReminder = async (medicationName, time) => {
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
        medicine: medicationName.trim(),
        reminderTime: reminderDate
    };

    const newReminder = await remindersCollection.insertOne(reminder);
    if (!newReminder.insertedId) throw new Error('Failed to set new reminder.');
    return newReminder;
};


// Check if any reminders in DB match current time
const checkReminders = async () => {
    const today = new Date(); 
    const estTime = new Date(today.getTime() + today.getTimezoneOffset() * 60000);

    const utcDate = new Date(estTime);
    utcDate.setHours(estTime.getHours() + 5);

    const reminders = await remindersCollection.find({
        reminderTime: {
            $gte: utcDate, 
            $lt: new Date(utcDate.getTime() + 60000)  
        }
    }).toArray();

    if (reminders.length > 0) {
        reminders.forEach(reminder => {
    
            console.log(`Reminder: Time to take ${reminder.medicine} now!`);
        });
    } else {
        console.log('No reminders at this time.');
    }
};