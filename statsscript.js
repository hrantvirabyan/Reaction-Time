document.addEventListener('DOMContentLoaded', function() {
    fetch('/getReactionTimes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const list = document.getElementById('reactionTimesList');
            data.forEach(time => {
                const listItem = document.createElement('li');
                listItem.textContent = `${time} ms`;
                list.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching reaction times:', error);
            // Handle errors or unauthorized access, maybe redirect to login
        });
});


document.addEventListener('DOMContentLoaded', function() {
    fetch('/getReactionTimes')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#reactionTimesTable tbody');
            // Clear any existing rows in the table body (except for the header)
            tableBody.innerHTML = '';

            data.forEach(item => {
                const row = tableBody.insertRow();
                const cellDateTime = row.insertCell(0);
                const cellReactionTime = row.insertCell(1);

                // Convert the recordedAt string into a Date object
                const date = new Date(item.recordedAt);

                // Check if the date is valid
                if (!isNaN(date.getTime())) {
                    // Format the date and time for display
                    cellDateTime.textContent = date.toLocaleString();
                } else {
                    // Handle invalid dates
                    cellDateTime.textContent = 'Invalid Date';
                }

                // Set the reaction time directly without appending 'ms'
                cellReactionTime.textContent = item.time.toFixed(2);
            });
        })
        .catch(error => {
            console.error('Error fetching reaction times:', error);
        });
});

function clearStats() {
    // Assuming your stats are displayed in a table with id="reactionTimesTable"
    const tableBody = document.querySelector('#reactionTimesTable tbody');
    tableBody.innerHTML = ''; // Clear the table body, removing all stats

    // If you have other elements displaying user data, clear them here as well
    // Example: document.getElementById('someUserSpecificElement').textContent = '';
}