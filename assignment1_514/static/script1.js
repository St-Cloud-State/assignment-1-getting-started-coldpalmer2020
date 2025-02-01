function showMessage(message, duration = 3000) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.style.display = 'block';

}

// Helper function to clear all result fields.
function clearAllResults() {
    document.getElementById('acceptResponse').innerHTML = '';
    document.getElementById('statusResponse').innerHTML = '';
    document.getElementById('changeResponse').innerHTML = '';
}

function formatResult(result) {
    let html = '';
    if (result.application_number !== undefined) {
        html += `<strong>Application Number:</strong> ${result.application_number}<br>`;
    }
    if (result.status) {
        html += `<strong>Status:</strong> ${result.status}<br>`;
    }
    // If there's an error property, show that instead
    if (result.error) {
        html = `<strong>Error:</strong> ${result.error}<br>`;
    }
    return html;
}

// Function to submit a new loan application.
function acceptApplication() {
    // Clear previous results
    clearAllResults();

    const name = document.getElementById('applicantName').value;
    const zipcode = document.getElementById('applicantZipcode').value;
    const data = { name, zipcode };

    fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        const responseDiv = document.getElementById('acceptResponse');
        responseDiv.innerHTML = formatResult(result);
        // Also show a message in the message box if there's a message in the result.
        if (result.message) {
            showMessage(result.message);
        }
    })
    .catch(error => {
        console.error('Error accepting application:', error);
        showMessage('Error accepting application');
    });
}

// Function to check the status of an existing application.
function checkStatus() {
    // Clear previous results
    clearAllResults();

    const appNumber = document.getElementById('applicationNumberCheck').value;

    fetch(`/api/applications/${appNumber}`)
    .then(response => response.json())
    .then(result => {
        const responseDiv = document.getElementById('statusResponse');
        responseDiv.innerHTML = formatResult(result);
        // Provide a message if the status was successfully retrieved.
        if (result.status) {
            showMessage(`Status retrieved: ${result.status}`);
        }
    })
    .catch(error => {
        console.error('Error checking status:', error);
        showMessage('Error checking application status');
    });
}

// Function to change the status of an existing application.
function changeStatus() {
    // Clear previous results
    clearAllResults();

    const appNumber = document.getElementById('applicationNumberChange').value;
    const newStatus = document.getElementById('newStatus').value;
    const data = { status: newStatus };

    fetch(`/api/applications/${appNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        const responseDiv = document.getElementById('changeResponse');
        responseDiv.innerHTML = formatResult(result);
        // Also show a message in the message box.
        if (result.message) {
            showMessage(result.message);
        }
    })
    .catch(error => {
        console.error('Error changing status:', error);
        showMessage('Error changing application status');
    });
}
