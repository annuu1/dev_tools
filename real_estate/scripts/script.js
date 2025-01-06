const scriptURL = 'https://script.google.com/macros/s/AKfycbw9fDxBpJp1gGuBgpRMkDFNK3o5uP2yB30-pZfTIO1aT_mS6ydLqWA1BudtQ-FBB3yP/exec';

const hostName = 'Bindu'

const contactedClients = document.querySelector("#contactedClients h3");
const allVisits = document.querySelector('#visits h3');

// Global variable to store the follow-ups data
let followUpsData = JSON.parse(localStorage.getItem('followUpsData')) || null;
let visitsData = JSON.parse(localStorage.getItem('visitsData')) || null;


// Show loading indicator
function showLoading() {
    document.body.insertAdjacentHTML('afterbegin', `
        <div id="loading" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(0, 0, 0, 0.7); color: white; padding: 20px; border-radius: 5px; z-index: 1000;">
          Loading, please wait...
        </div>
      `);
      
      // Add CSS animation to change background color continuously
      var style = document.createElement('style');
      style.innerHTML = `
        @keyframes colorChange {
          0% { background-color: rgba(0, 0, 0, 0.7); }
          25% { background-color: rgba(255, 40, 40, 0.7); }
          50% { background-color: rgba(25, 233, 181, 0.7); }
          75% { background-color: rgba(199, 108, 235, 0.7); }
          100% { background-color: rgba(0, 0, 0, 0.7); }
        }
        #loading {
          animation: colorChange 4s infinite;
        }
      `;
      
      document.head.appendChild(style);

    
    document.getElementById('loading').style.display = 'block';
}

// Hide loading indicator
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Fetch the follow-ups and store the data in a global variable
async function getFollowUps() {
    try {
        showLoading(); // Show loading indicator
        const response = await fetch(`${scriptURL}?action=getFollowUps`);
        const data = await response.json();
        followUpsData = data;  // Store the data in the global variable
        // Store data in localStorage for future use
        localStorage.setItem('followUpsData', JSON.stringify(followUpsData));
    } catch (error) {
        console.error('Error fetching follow-ups:', error);
    } finally {
        hideLoading(); // Hide loading indicator
    }
}

async function getVisits() {
    try {
        showLoading(); // Show loading indicator
        const response = await fetch(`${scriptURL}?action=getVisits`);
        const data = await response.json();
        visitsData = data.filter(element => {            
            return element.host === hostName;
        });
                
        // Store data in localStorage for future use
        localStorage.setItem('visitsData', JSON.stringify(visitsData));
    } catch (error) {
        alert('Error in getting visits: ' + error);
    } finally {
        hideLoading(); // Hide loading indicator
    }
}


      // Function to check if the date is less than or equal to today
      function isDateLessThanOrEqualToToday(inputDate) {
        const date = new Date(inputDate)
        // console.log(date);
        
        const today = new Date();
        if(date.getFullYear()< today.getFullYear()){
      
          return true;
        }else if(date.getFullYear()=== today.getFullYear())
        {    
          if(date.getMonth() < today.getMonth()){
      
            return true;
      
            }else if(date.getMonth() === today.getMonth()){
            if(date.getDate()<= today.getDate()){
            // console.log(date.getDate());
            return true;
           }
        }
        }
      }

      
// Function to process the data and update the DOM
function recommended(data) {
    const recommend = data.reduce((acc, element) => {
        if (isDateLessThanOrEqualToToday(element.date) && element.status != 'Closed') {
            acc += 1;
        }
        return acc;
    }, 0);

    const recommended = document.querySelector("#recommended h3");
    recommended ? recommended.textContent = recommend : "";
}

function recommendedVisits(data) {
    const recommend = data.reduce((acc, element) => {
        if (isDateLessThanOrEqualToToday(element.date) && element.status != 'Closed') {
            acc += 1;
        }
        return acc;
    }, 0);

    const recommended = document.querySelector("#recommendedVisits h3");
    recommended ? recommended.textContent = recommend : "";
}

// Function to process the data and update the DOM
function openedFollowUps(data) {
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
        recommendedVisits(visitsData);

        openedFollowUps(followUpsData);
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