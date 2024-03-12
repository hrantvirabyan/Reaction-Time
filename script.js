// Get the div and the text element
var reactionScreen = document.getElementById('reactionScreen');
var reactionText = document.getElementById('reactionText');
var loader = document.querySelector('.lds-facebook');

// Track the phase
var phase = 0;
var startTime; // Declare startTime outside to make it accessible throughout the script
var timeoutId; // Declare a variable to store the timeout ID

function updatePhase() {
    if (phase === 1) {
        // If it's yellow, reset everything including cancelling the timeout
        clearTimeout(timeoutId); // Cancel the ongoing timeout
        reactionScreen.style.backgroundColor = '#FF474A'; // Red background
        reactionText.textContent = 'Too soon! Click to try again.'; // Prompt for premature click
        loader.style.display = 'none'; // Ensure loader is hidden
        phase = 0; // Reset phase to initial
        return; // Exit the function to prevent further execution
    }

    if (phase === 0) {
        // Initial setup, show yellow and prepare for green
        reactionScreen.style.backgroundColor = '#FFF67E'; // Yellow background
        reactionText.textContent = 'Wait for green...'; // Instruction for the user
        loader.style.display = 'block'; // Show loader

        // Random delay, then show green
        var delay = Math.random() * (6000 - 2000) + 2000;
        timeoutId = setTimeout(function() {
            reactionScreen.style.backgroundColor = '#57b846'; // Green background
            loader.style.display = 'none'; // Hide loader
            // Start timing
            phase = 2; // Move to next phase
            startTime = performance.now();
        }, delay);
        phase = 1; // Mark as waiting for green
    } else if (phase === 2) {
        // Reaction time measured
        var reactionTime = performance.now() - startTime - 60; // Corrected reaction time calculation
        reactionScreen.style.backgroundColor = '#59B4C3'; // Change to another color, e.g., blue for reset
        reactionText.textContent = reactionTime.toFixed(2) + " ms"; // Display reaction time rounded to two decimals
        saveReactionTime(reactionTime);
        saveReactionTime(reactionTime);
        phase = 0; // Set phase for reset
    } else if (phase === 3) {
        // This phase seems unused but could be for a manual reset or additional feature
    }
}



function saveReactionTime(reactionTime) {
    fetch('http://localhost:3000/saveReactionTime', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ reactionTime }),
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch((error) => console.error('Error:', error));
  }
  

  document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');

    logoutButton.addEventListener('click', function() {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Sending an empty body as this is just a logout request
            body: JSON.stringify({})
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('Logout failed.');
        })
        .then(message => {
            alert(message); // Or handle the logout success in another way
            window.location.href = '/login.html'; // Redirect to login page or home page as needed
        })
        .catch(error => {
            console.error(error);
            alert('Logout failed, please try again.');
        });
    });
});


reactionScreen.addEventListener('click', updatePhase);
