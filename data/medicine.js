import * as mongoCollections from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const userCollection = await mongoCollections.user();

const get_medicine_by_id = async (userId, medicineId) => {
    if (!userId || typeof userId !== 'string' || userId.trim() === "") throw 'Error: Invalid user ID';
    if (!medicineId || typeof medicineId !== 'string' || medicineId.trim() === "") throw 'Error: Invalid medicine ID';
    
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) throw 'Error: User not found';
    
    const medicine = user.medicine.find(med => med._id.toString() === medicineId);
    if (!medicine) throw 'Error: Medicine not found';
    
    return medicine;
};

const get_all_medications = async (userId) => {
    if (!userId || typeof userId !== 'string' || userId.trim() === "") throw 'Error: Invalid user ID';
    
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) throw 'Error: User not found';
    
    return user.medicine;
};

const create_medication = async (userId, medicationName, strength, dosageForm, frequency) => {
    if (!userId || typeof userId !== 'string' || userId.trim() === "") throw 'Error: Invalid user ID';
    if (!medicationName || !strength || !dosageForm || !frequency) throw 'All fields: medicationName, strength, dosageForm, frequency must be filled in';
    if (typeof medicationName !== 'string' || medicationName.trim() === '') throw 'Medication name must be a non-empty string';
    if (typeof strength !== 'number' || isNaN(strength) || strength <= 0) throw 'Strength must be a positive number';
    if (typeof dosageForm !== 'string' || dosageForm.trim() === '') throw 'Dosage form must be a non-empty string';
    if (typeof frequency !== 'string' || frequency.trim() === '') throw 'Frequency must be a non-empty string';

    const medicine = {
        _id: new ObjectId(),
        medicationName: medicationName.trim(),
        strength: strength,
        dosageForm: dosageForm.trim(),
        frequency: frequency.trim(),
        currentlyInUse: true,
        dateAdded: new Date()
    };

    const updateInfo = await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { medicine: medicine } }
    );

    if (!updateInfo.modifiedCount) throw 'Error: Failed to add medication';
    return medicine;
};

const delete_medication = async (userId, medicineId) => {
    if (!userId || typeof userId !== 'string' || userId.trim() === "") throw 'Error: Invalid user ID';
    if (!medicineId || typeof medicineId !== 'string' || medicineId.trim() === "") throw 'Error: Invalid medicine ID';

    const updateInfo = await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { medicine: { _id: new ObjectId(medicineId) } } }
    );

    if (!updateInfo.modifiedCount) throw 'Error: Failed to delete medication or medication not found';
    return { deleted: true, medicineId };
};

export { create_medication, get_all_medications, get_medicine_by_id, delete_medication };