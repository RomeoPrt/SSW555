const removeMedication = async (medicineId) => {
    try {
        const response = await fetch(`/api/medicine/${medicineId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Remove the medication from the DOM
            const medElement = document.getElementById(`med-${medicineId}`);
            if (medElement) {
                medElement.remove();
            }
        } else {
            const errorData = await response.json();
            alert(`Failed to delete medication: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Error deleting medication:', error);
        alert('An error occurred while trying to delete the medication.');
    }
}