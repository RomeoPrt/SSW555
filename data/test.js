import { strict as assert } from 'assert';
import { ObjectId } from 'mongodb';
import { create_medication } from './api.js'; // Adjust this path as needed

// Mock the medicineCollection with a simple insertOne function
const medicineCollection = {
    insertOne: async (medicine) => ({ insertedId: new ObjectId() })
};

// Attach the mock collection globally for the function to access it
global.medicineCollection = medicineCollection;

(async () => {
    // Test 1: Successful medication creation
    try {
        const medicationName = 'Aspirin';
        const strength = '500mg';
        const dosageForm = 'Tablet';
        const frequency = 'Twice a day';

        const result = await create_medication(medicationName, strength, dosageForm, frequency);

        assert.equal(result.medicationName, medicationName);
        assert.equal(result.strength, strength);
        assert.equal(result.dosageForm, dosageForm);
        assert.equal(result.frequency, frequency);
        assert.equal(result.currentlyInUse, true);
        assert(result.createdAt instanceof Date);
        
        console.log('Test 1 passed: Successful medication creation');
    } catch (error) {
        console.error('Test 1 failed:', error);
    }

    // Test 2: Missing medicationName should throw an error
    try {
        const strength = '500mg';
        const dosageForm = 'Tablet';
        const frequency = 'Twice a day';

        await create_medication(undefined, strength, dosageForm, frequency);
        
        console.error('Test 2 failed: Error not thrown for missing medicationName');
    } catch (error) {
        console.log('Test 2 passed: Missing medicationName threw an error');
    }

    // Test 3: Missing strength should throw an error
    try {
        const medicationName = 'Aspirin';
        const dosageForm = 'Tablet';
        const frequency = 'Twice a day';

        await create_medication(medicationName, undefined, dosageForm, frequency);
        
        console.error('Test 3 failed: Error not thrown for missing strength');
    } catch (error) {
        console.log('Test 3 passed: Missing strength threw an error');
    }

    // Test 4: Missing dosageForm should throw an error
    try {
        const medicationName = 'Aspirin';
        const strength = '500mg';
        const frequency = 'Twice a day';

        await create_medication(medicationName, strength, undefined, frequency);
        
        console.error('Test 4 failed: Error not thrown for missing dosageForm');
    } catch (error) {
        console.log('Test 4 passed: Missing dosageForm threw an error');
    }

    // Test 5: Missing frequency should throw an error
    try {
        const medicationName = 'Aspirin';
        const strength = '500mg';
        const dosageForm = 'Tablet';

        await create_medication(medicationName, strength, dosageForm, undefined);
        
        console.error('Test 5 failed: Error not thrown for missing frequency');
    } catch (error) {
        console.log('Test 5 passed: Missing frequency threw an error');
    }
})();
