document.addEventListener("DOMContentLoaded", function () {
  const addMedicineForm = document.getElementById("addMedicineForm");
  const medicineList = document.getElementById("medicineList");
  const errorMessage = document.getElementById("errorMessage");

  addMedicineForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    errorMessage.textContent = "";

    const formData = {
      medicationName: document.getElementById("medicationName").value,
      dosage: parseFloat(document.getElementById("dosage").value),
      dosageForm: document.getElementById("dosageForm").value,
      frequency: (() => {
        const number = document.getElementById("frequencyNumber").value;
        const unit = document.getElementById("frequencyUnit").value;
        return `Every ${number} ${unit}(s)`;
      })(),
    };

    try {
      const response = await fetch("/api/medicine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add medication");
      }

      const newMedicine = await response.json();

      // Create new medicine item element
      const medicineItem = document.createElement("div");
      medicineItem.className = "medicine-item";
      medicineItem.id = `med-${newMedicine._id}`;
      medicineItem.innerHTML = `
                <h3>${newMedicine.medicationName}</h3>
                <div class="medicine-details">
                    <div>Dosage: ${newMedicine.dosage} tablets/dose</div>
                    <div>Form: ${newMedicine.dosageForm}</div>
                    <div>Frequency: ${newMedicine.frequency}</div>
                    <button onclick="removeMedication('${newMedicine._id}')" class="remove-btn">Remove</button>
                </div>
            `;

      medicineList.appendChild(medicineItem);
      addMedicineForm.reset();
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });

  document
    .getElementById("frequencyOption")
    .addEventListener("change", function (e) {
      const customInput = document.getElementById("customFrequency");
      if (e.target.value === "custom") {
        customInput.style.display = "block";
        customInput.required = true;
      } else {
        customInput.style.display = "none";
        customInput.required = false;
      }
    });
});
