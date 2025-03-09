const API_KEY = 'AIzaSyDRo0I6TPLi_AXhM4w_Ruc1u1IFv-ps7D0'; // Replace with your Google Sheets API key
const SHEET_ID = '1gVUYypveGXRqL7DLHKNXI4FpAMLnX7lGQqvZFi9Vhbg'; // Replace with your Google Sheet ID
const SHEET_NAME = 'Sheet1'; // Replace with the name of your sheet

const SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/1gVUYypveGXRqL7DLHKNXI4FpAMLnX7lGQqvZFi9Vhbg/values/Sheet1?key=AIzaSyDRo0I6TPLi_AXhM4w_Ruc1u1IFv-ps7D0`;

async function fetchData() {
  try {
    const response = await fetch(SHEET_URL);
    const data = await response.json();
    console.log('Fetched Data:', data);

    processSheetData(data.values);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function processSheetData(values) {
  // Assuming the first row is the headers
  const headers = values[0];
  const metricsData = values.slice(1);

  // Find index of each metric
  const impressionsIndex = headers.indexOf('Impressions');
  const clicksIndex = headers.indexOf('Clicks');
  const viewabilityIndex = headers.indexOf('Viewability Rate');
  const engagementIndex = headers.indexOf('Engagement Rate');
  const spendIndex = headers.indexOf('Spend');
  const statusIndex = headers.indexOf('Status');

  // Extract the first row of data
  const row = metricsData[0]; // Adjust index if you have multiple rows

  // Populate metrics in the dashboard
  document.getElementById('impressions').innerText = row[impressionsIndex] || '0';
  document.getElementById('clicks').innerText = row[clicksIndex] || '0';
  document.getElementById('viewability').innerText = row[viewabilityIndex] || 'NIL';
  document.getElementById('engagement').innerText = row[engagementIndex] || 'NIL';
  document.getElementById('spend').innerText = row[spendIndex] || '0';
  document.getElementById('status').innerText = row[statusIndex] || 'ENDED';

  // Pass data to charts
  renderCharts(metricsData, impressionsIndex, clicksIndex);
}

function renderCharts(data, impressionsIndex, clicksIndex) {
  // Extract labels and data for charts
  const labels = data.map(row => row[0]); // Assuming the first column is the name/campaign
  const impressionsData = data.map(row => parseInt(row[impressionsIndex] || 0));
  const clicksData = data.map(row => parseInt(row[clicksIndex] || 0));

  // Render Impressions Chart
  const ctx1 = document.getElementById('impressionsChart').getContext('2d');
  new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Impressions',
        data: impressionsData,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // Render Clicks Chart
  const ctx2 = document.getElementById('clicksChart').getContext('2d');
  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Clicks',
        data: clicksData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Call the fetchData function on page load
fetchData();
