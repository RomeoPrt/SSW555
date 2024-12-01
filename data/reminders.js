import * as mongoCollections from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const medicineCollection = await mongoCollections.medicine();
const remindersCollection = await mongoCollections.reminder();


// function to create a new reminder
const createReminder = async (medicationName, time) => {
    if (!medicationName || typeof medicationName !== 'string' || medicationName.trim() === '') {
        throw new Error('Medication name must be a non-empty string');
    }

    // Adjust the time format check to 24-hour "HH:MM"
    if (!time || typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time.trim())) {
        throw new Error('Time must be in HH:MM 24-hour format');
    }

    const today = new Date();
    // Split the time into hours and minutes
    const [hours, minutes] = time.split(':').map(Number);

    // Create the reminder date with today's date but the selected hours and minutes
    const reminderDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);

    const reminder = {
        medicine: medicationName.trim(),
        reminderTime: reminderDate
    };

    // Insert the reminder into the database
    const newReminder = await remindersCollection.insertOne(reminder);
    if (!newReminder.insertedId) throw new Error('Failed to set new reminder.');
    return newReminder;
};


// check if any reminders in DB match current time
const checkReminders = async () => {
    const today = new Date();

    // Convert current EST time to UTC time
    // Assuming the current time is in EST (UTC-5)
    const estTime = new Date(today.getTime() + today.getTimezoneOffset() * 60000);  // Get EST time

    // Convert EST time to UTC
    const utcDate = new Date(estTime);
    utcDate.setHours(estTime.getHours() + 5);  // Convert from EST (UTC-5) to UTC (UTC+0)

    // Get reminders from the database that have the same time (in UTC) as the current time
    const reminders = await remindersCollection.find({
        reminderTime: {
            $gte: utcDate, 
            $lt: new Date(utcDate.getTime() + 60000)  // Compare with 1 minute interval
        }
    }).toArray();

    // If any reminder matches the current time (in UTC), trigger the reminder
    if (reminders.length > 0) {
        reminders.forEach(reminder => {
            // Trigger the reminder (e.g., send a notification, or log it)
            console.log(`Reminder: Time to take ${reminder.medicine} now!`);
        });
    } else {
        console.log('No reminders at this time.');
    }
};