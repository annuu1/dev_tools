const scriptURL = 'https://script.google.com/macros/s/AKfycbwjfceoeNeTOOPZY-ijuz6ZeINsjPC5BvfPUYJ9YAhJBU6RXd1CR8Ep6NEIExkWcwrPAQ/exec';


const contactedClients = document.querySelector("#contactedClients h3");
const allVisits = document.querySelector('#visits h3')

// Global variable to store the follow-ups data
let followUpsData = null;
let visitsData = null;

// Fetch the follow-ups and store the data in a global variable
async function getFollowUps() {
    try {
        const response = await fetch(`${scriptURL}?action=getFollowUps`);
        const data = await response.json();
        followUpsData = data;  // Store the data in the global variable
        // console.log('Follow-ups data fetched:', data);
    } catch (error) {
        console.error('Error fetching follow-ups:', error);
    }
}

async function getVisits() {
    try {
        const response = await fetch(`${scriptURL}?action=getVisits`);
        const data = await response.json();
        visitsData = data;
    } catch (error) {
        alert('Error in getting visits : '+ error)        
    }
}

// Function to process the data and update the DOM
function recommended(data) {
    // Use reduce to count the recommendations
    const recommend = data.reduce((acc, element) => {
        if (formatDateFromInput(element.date) === formatDateFromInput(new Date())) {
            acc += 1;
        }
        return acc;  // Always return the accumulator
    }, 0); // Start accumulator at 0

    const recommended = document.querySelector("#recommended h3");

    // Update the DOM with the calculated values
    recommended.textContent = recommend;
}

// Function to process the data and update the DOM
function open(data) {
    // Use reduce to count the recommendations
    
    const recommend = data.reduce((acc, element) => {
        // console.log(element.status);
        if (element.status === 'Open') {
            acc += 1;
        }
        return acc;  // Always return the accumulator
    }, 0); // Start accumulator at 0

    const openFollowUps = document.querySelector("#open h3");

    // Update the DOM with the calculated values
    openFollowUps.textContent = recommend;
}

// Function to process the data and update the DOM
function closedFollowUps(data) {
    // Use reduce to count the recommendations
    
    const recommend = data.reduce((acc, element) => {
        // console.log(element.status);
        if (element.status === 'Closed') {
            acc += 1;
        }
        return acc;  // Always return the accumulator
    }, 0); // Start accumulator at 0

    const closedFollowUps = document.querySelector("#closed h3");

    // Update the DOM with the calculated values
    closedFollowUps.textContent = recommend;
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
        contactedClients.textContent = followUpsData.length;
        recommended(followUpsData);
        open(followUpsData)
        closedFollowUps(followUpsData)
    } else {
        console.log('No follow-ups data available yet.');
    }
    
    if(visitsData){
        allVisits.textContent = visitsData.length;
    }
}


