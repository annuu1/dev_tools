const scriptURL = 'https://script.google.com/macros/s/AKfycbw9fDxBpJp1gGuBgpRMkDFNK3o5uP2yB30-pZfTIO1aT_mS6ydLqWA1BudtQ-FBB3yP/exec';

const contactedClients = document.querySelector("#contactedClients h3");
const allVisits = document.querySelector('#visits h3');

// Global variable to store the follow-ups data
let followUpsData = JSON.parse(localStorage.getItem('followUpsData')) || null;
let visitsData = JSON.parse(localStorage.getItem('visitsData')) || null;

// Fetch the follow-ups and store the data in a global variable
async function getFollowUps() {
    try {
        const response = await fetch(`${scriptURL}?action=getFollowUps`);
        const data = await response.json();
        followUpsData = data;  // Store the data in the global variable
        // Store data in localStorage for future use
        localStorage.setItem('followUpsData', JSON.stringify(followUpsData));
    } catch (error) {
        console.error('Error fetching follow-ups:', error);
    }
}

async function getVisits() {
    try {
        const response = await fetch(`${scriptURL}?action=getVisits`);
        const data = await response.json();
        visitsData = data;
        // Store data in localStorage for future use
        localStorage.setItem('visitsData', JSON.stringify(visitsData));
        // window.location.reload()
    } catch (error) {
        alert('Error in getting visits : ' + error);
    }
}

// Function to process the data and update the DOM
function recommended(data) {
    const recommend = data.reduce((acc, element) => {
        if (formatDateFromInput(element.date) === formatDateFromInput(new Date())) {
            acc += 1;
        }
        return acc;
    }, 0);

    const recommended = document.querySelector("#recommended h3");
    recommended ? recommended.textContent = recommend : "";
}

// Function to process the data and update the DOM
function open(data) {
    const recommend = data.reduce((acc, element) => {
        if (element.status === 'Open') {
            acc += 1;
        }
        return acc;
    }, 0);

    const openFollowUps = document.querySelector("#open h3");
    openFollowUps ? openFollowUps.textContent = recommend : "";
}

// Function to process the data and update the DOM
function closedFollowUps(data) {
    const recommend = data.reduce((acc, element) => {
        if (element.status === 'Closed') {
            acc += 1;
        }
        return acc;
    }, 0);

    const closedFollowUps = document.querySelector("#closed h3");
    closedFollowUps ? closedFollowUps.textContent = recommend : "";
}

// Format date from input string to M/D/YYYY format
function formatDateFromInput(inputDate) {
    const date = new Date(inputDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

// Update the dashboard with the fetched data
function updateDashboard() {
    if (followUpsData) {
        contactedClients? contactedClients.textContent = followUpsData.length : "";
        recommended(followUpsData);
        open(followUpsData);
        closedFollowUps(followUpsData);
    } else {
        console.log('No follow-ups data available yet.');
    }

    if (visitsData) {
        allVisits ? allVisits.textContent = visitsData.length : '';
    }
}

// Function to load and update data
async function loadAndUpdateData() {
    // First, update the data from API if possible
    await getFollowUps();
    await getVisits();

    // Then, update the dashboard with the latest data (from localStorage or API)
    updateDashboard();
}

// Call the function to load data initially when the page loads
loadAndUpdateData();

// Call getFollowUps once when the page loads
window.onload = async function () {
    // Check if followUpsData exists in localStorage, and if so, use it
    if (!followUpsData) {
      await getFollowUps(); // Fetch data if not in localStorage
    }
    if (!visitsData) {
      await getVisits();
    }

    updateDashboard(); // Update the dashboard after the data is fetched or from localStorage
  };