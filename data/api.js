import * as mongoCollections from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const medicineCollection = await mongoCollections.medicine();

const get_medicine_by_id = async (id) => {
    if (!id || typeof id !== 'string' || id.trim() === "") throw 'Error: is not a valid string';
    const medicine = await mongoCollections.findOne({ _id: new ObjectId(id) });
    return medicine
}

const create_medication = async (medicationName, strength, dosageForm, frequency) => {
    if ( !medicationName, !strength, !dosageForm, !frequency) throw 'the fields: medicationName, strength, dosageForm, frequency. Must be field in '
    if (typeof medicationName !== 'string' || medicationName.trim() === '') throw 'Medication name must be a non-empty string'
    if (typeof strength !== 'number' || isNaN(strength) || strength <= 0) throw 'Strength must be a positive number'
    if (typeof dosageForm !== 'string' || dosageForm.trim() === '') throw 'Dosage form must be a non-empty string'
    if (typeof frequency !== 'string' || frequency.trim() === '') throw 'Frequency must be a non-empty string';

    const medicine = {
        _id: new ObjectId(),
        medicationName: medicationName.trim(), 
        strength: strength, 
        dosageForm: dosageForm.trim(), 
        frequency: frequency.trim(),
        currentlyInUse: true,
    }

    const newMedicine = await medicineCollection.insertOne(bookClub);
    if (!newMedicine.insertedId) throw 'Error: Insert failed!'
    return medicine
}


export { create_medication }