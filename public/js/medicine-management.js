// Add this to a new file: public/js/medicine-management.js
document.addEventListener('DOMContentLoaded', function() {
    const addMedicineForm = document.getElementById('addMedicineForm');
    const medicineList = document.getElementById('medicineList');
    const errorMessage = document.getElementById('errorMessage');

    addMedicineForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        errorMessage.textContent = '';

        const formData = {
            medicationName: document.getElementById('medicationName').value,
            strength: parseInt(document.getElementById('strength').value),
            dosageForm: document.getElementById('dosageForm').value,
            frequency: document.getElementById('frequency').value
        };

        try {
            const response = await fetch('/api/medicine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to add medication');
            }

            const newMedicine = await response.json();
            
            // Create new medicine item element
            const medicineItem = document.createElement('div');
            medicineItem.className = 'medicine-item';
            medicineItem.innerHTML = `
                <h3>${newMedicine.medicationName}</h3>
                <div class="medicine-details">
                    <div>Strength: ${newMedicine.strength}mg</div>
                    <div>Form: ${newMedicine.dosageForm}</div>
                    <div>Frequency: ${newMedicine.frequency}</div>
                </div>
            `;

            // Add to list
            medicineList.appendChild(medicineItem);
            
            // Reset form
            addMedicineForm.reset();

        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
});