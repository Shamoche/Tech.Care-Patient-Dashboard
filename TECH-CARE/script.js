document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://fedskillstest.coalitiontechnologies.workers.dev';
    const username = '[YOUR_USERNAME]';
    const password = '[YOUR_PASSWORD]';
    const authKey = 'Basic ' + btoa(username + ':' + password);

    fetch(apiURL, {
        headers: {
            'Authorization': authKey
        }
    })
    .then(response => response.json())
    .then(data => {
        const patients = data.patients;
        populatePatientsList(patients);
        if (patients.length > 0) {
            populatePatientDetails(patients[0]);
            populateMetrics(patients[0].metrics);
            renderChart(patients[0].bloodPressure);
        }
    })
    .catch(error => console.error('Error fetching data:', error));
});

function populatePatientsList(patients) {
    const patientsList = document.querySelector('.patients-list');
    patientsList.innerHTML = patients.map(patient => `
        <div class="patient" onclick="selectPatient(${patient.id})">
            <img src="${patient.photo}" alt="${patient.name}">
            <span>${patient.name}</span>
        </div>
    `).join('');
}

function populatePatientDetails(patient) {
    const patientDetails = document.querySelector('.patient-details');
    patientDetails.innerHTML = `
        <img src="${patient.photo}" alt="${patient.name}">
        <h2>${patient.name}</h2>
        <p>Date of Birth: ${patient.dob}</p>
        <p>Gender: ${patient.gender}</p>
        <p>Contact: ${patient.contact}</p>
        <p>Emergency Contact: ${patient.emergencyContact}</p>
        <p>Insurance Provider: ${patient.insuranceProvider}</p>
    `;
}

function populateMetrics(metrics) {
    document.getElementById('respiratoryRate').textContent = `${metrics.respiratoryRate} bpm`;
    document.getElementById('temperature').textContent = `${metrics.temperature}°F`;
    document.getElementById('heartRate').textContent = `${metrics.heartRate} bpm`;
}

function renderChart(bloodPressureData) {
    const ctx = document.getElementById('bloodPressureChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: bloodPressureData.map(data => data.date),
            datasets: [
                {
                    label: 'Systolic',
                    data: bloodPressureData.map(data => data.systolic),
                    borderColor: 'rgb(255, 99, 132)',
                    fill: false,
                },
                {
                    label: 'Diastolic',
                    data: bloodPressureData.map(data => data.diastolic),
                    borderColor: 'rgb(54, 162, 235)',
                    fill: false,
                }
            ]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month'
                    }
                }
            }
        }
    });
}

function selectPatient(id) {
    const apiURL = 'https://fedskillstest.coalitiontechnologies.workers.dev';
    const username = '[YOUR_USERNAME]';
    const password = '[YOUR_PASSWORD]';
    const authKey = 'Basic ' + btoa(username + ':' + password);

    fetch(`${apiURL}/${id}`, {
        headers: {
            'Authorization': authKey
        }
    })
    .then(response => response.json())
    .then(patient => {
        populatePatientDetails(patient);
        populateMetrics(patient.metrics);
        renderChart(patient.bloodPressure);
    })
    .catch(error => console.error('Error fetching patient data:', error));
}
