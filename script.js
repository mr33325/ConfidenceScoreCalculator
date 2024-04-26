var doc_Loaded= false;
document.addEventListener("DOMContentLoaded", function() {
    // This function will run when the document is loaded
    calculateConfidence();
  });
  
  document.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      calculateConfidence();
    }
  });
  
  function calculateConfidence() {
    var attempted = parseInt(document.getElementById("attempted").value);
    var total = parseInt(document.getElementById("total").value);
    var correct = parseInt(document.getElementById("correct").value);
  
    // Calculate attempt rate and accuracy rate
    var attemptRate = (attempted / total) * 100;
    var accuracyRate = (correct / attempted) * 100;
  
    // Calculate confidence score
    var confidenceScore = (attemptRate * accuracyRate) / 100;
    if (isNaN(confidenceScore)) confidenceScore = 0;
  
    // Map confidence score to range 0-100
    confidenceScore = mapRange(confidenceScore, 0, 100, 0, 10);
  
    // Save confidence data to localStorage
    if(doc_Loaded){
      var confidenceData = localStorage.getItem("confidenceData");
      if (!confidenceData) {
        confidenceData = [];
      } else {
        confidenceData = JSON.parse(confidenceData);
      }
      confidenceData.push({
        date: new Date().toISOString().split('T')[0], // Get today's date
        score: confidenceScore
      });
      localStorage.setItem("confidenceData", JSON.stringify(confidenceData));
    }
  
    // Update confidence score text and progress bar
    updateScoreAndBar(confidenceScore);
    displayChart();

    // Update timestamp
    var timestamp = new Date().toLocaleTimeString();
    document.getElementById("timestamp").innerText = timestamp;

    // Update doc is loaded to true
    doc_Loaded= true;
  }
  
  function updateScoreAndBar(confidenceScore) {
    // Update confidence score text
    var confidenceSpan = document.getElementById("confidenceScore");
    confidenceSpan.innerText = confidenceScore.toFixed(1);
  
    // Update progress bar color based on confidence score
    var confidenceBar = document.getElementById("confidenceBar");
    if (confidenceScore < 4) {
      confidenceBar.classList.remove("bg-warning", "bg-success");
      confidenceBar.classList.add("bg-danger");
    } else if (confidenceScore < 7) {
      confidenceBar.classList.remove("bg-danger", "bg-success");
      confidenceBar.classList.add("bg-warning");
    } else {
      confidenceBar.classList.remove("bg-danger", "bg-warning");
      confidenceBar.classList.add("bg-success");
    }
  
    // Trigger reflow before updating progress bar width to ensure animation
    confidenceBar.offsetWidth;
    var valueNow_Confidence_Score= mapRange(confidenceScore, 0, 10, 0, 100) ;
    // Update progress bar width and animate
    confidenceBar.style.width = valueNow_Confidence_Score + "%";
    confidenceBar.style.transition = "width 0.5s ease-in-out";
  }
  
  function displayChart() {
    var confidenceData = JSON.parse(localStorage.getItem("confidenceData")) || [];
    var dates = confidenceData.map(data => data.date);
    var scores = confidenceData.map(data => data.score);
  
    var ctx = document.getElementById('confidenceChart').getContext('2d');

    var existingChart = Chart.getChart(ctx);

    // If an existing chart instance is found, destroy it
    if (existingChart) {
        existingChart.destroy();
    }
  
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Confidence Score',
          data: scores,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1,
          tension: 0.4
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              Max: 10
            }
          }]
        }
      }
    });
  }
  
  function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }
  