const scriptURL = 'https://script.google.com/macros/s/AKfycbwjfceoeNeTOOPZY-ijuz6ZeINsjPC5BvfPUYJ9YAhJBU6RXd1CR8Ep6NEIExkWcwrPAQ/exec';

// Global variable to store the follow-ups data
let followUpsData = null;

// Fetch the follow-ups and store the data in a global variable
async function getFollowUps() {
    try {
        const response = await fetch(`${scriptURL}?action=getFollowUps`);
        const data = await response.json();
        followUpsData = data;  // Store the data in the global variable
        console.log('Follow-ups data fetched:', data);
    } catch (error) {
        console.error('Error fetching follow-ups:', error);
    }
}

// Function to process the data and update the DOM
function recommended(data) {
    // Use reduce to count the recommendations
    const recommend = data.reduce((acc, element) => {
        if (formatDateFromInput(element.date) === formatDateFromInput(new Date())) {
            acc += 1;  // Increment accumulator for each match
        }
        return acc;  // Always return the accumulator
    }, 0); // Start accumulator at 0

    const recommended = document.querySelector("#recommended h3");
    const contactedClients = document.querySelector("#contactedClients h3");

    // Update the DOM with the calculated values
    recommended.textContent = recommend;
    contactedClients.textContent = data.length;
}

// Format date from input string to M/D/YYYY format
function formatDateFromInput(inputDate) {
    const date = new Date(inputDate); // Convert string to Date object

    const month = date.getMonth() + 1; // Month is 0-based, so add 1
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}

// Update the dashboard with the fetched data
function updateDashboard() {
    if (followUpsData) {
        recommended(followUpsData);  // Use the stored data for recommendations
    } else {
        console.log('No follow-ups data available yet.');
    }
}

// Call getFollowUps once when the page loads
window.onload = async function() {
    await getFollowUps();  // Wait for the fetch to complete
    updateDashboard();     // Update the dashboard after the data is fetched
};
