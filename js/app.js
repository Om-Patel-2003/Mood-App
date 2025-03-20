// On page load, load mood logs and set event listeners
document.addEventListener("DOMContentLoaded", () => {
  loadMoodLogs(); // Load past moods
  setEventListeners(); // Setup button and dropdown listeners
});

// Set up event listeners for mood buttons and view selection
function setEventListeners() {
  const moodButtons = document.querySelectorAll(".mood-btn");
  moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mood = button.dataset.mood;
      saveMood(mood);
      updateSelectedMood(mood);
      loadMoodLogs();
    });
  });

  document.getElementById("view-select").addEventListener("change", (e) => {
    loadMoodLogs(e.target.value);
  });
}

// Save mood to LocalStorage with date
function saveMood(mood) {
  const today = getFormattedDate();
  let moodLogs = getMoodLogs();
  moodLogs[today] = mood;
  localStorage.setItem("moodLogs", JSON.stringify(moodLogs));
}

// Get saved mood logs from LocalStorage
function getMoodLogs() {
  return JSON.parse(localStorage.getItem("moodLogs")) || {};
}

// Update the selected mood text dynamically
function updateSelectedMood(mood) {
  document.getElementById("selected-mood").innerText = `Today's Mood: ${mood}`;
}

// Load and display mood logs based on selected view
function loadMoodLogs(view = "daily") {
  const moodLogs = getMoodLogs();
  const moodLogContainer = document.getElementById("mood-log");
  moodLogContainer.innerHTML = "";

  if (view === "calendar") {
    displayCalendarView(moodLogs);
    return;
  }

  const entries = Object.keys(moodLogs).reverse();
  if (entries.length === 0) {
    moodLogContainer.innerHTML = `<p>No mood logs found. Start tracking now! 😊</p>`;
    return;
  }

  entries.forEach((date) => {
    const mood = moodLogs[date];
    if (isValidView(date, view)) {
      moodLogContainer.innerHTML += `
        <div class="mood-entry">
          <strong>${date}</strong>
          <span>${mood}</span>
        </div>
      `;
    }
  });
}

// Check if a date fits the selected view
function isValidView(date, view) {
  const today = new Date();
  const entryDate = new Date(date);
  const difference = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));

  if (view === "daily") return true;
  if (view === "weekly") return difference < 7;
  if (view === "monthly") return difference < 30;
  return false;
}

// Display Calendar View for mood logs
function displayCalendarView(moodLogs) {
  const moodLogContainer = document.getElementById("mood-log");
  moodLogContainer.innerHTML = '<div class="mood-calendar"></div>';
  const calendarGrid = document.querySelector(".mood-calendar");

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const dateStr = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    const mood = moodLogs[dateStr] || "❔";
    calendarGrid.innerHTML += `
      <div class="mood-day">
        ${i}<br>${mood}
      </div>
    `;
  }
}

// Get today's date in YYYY-MM-DD format
function getFormattedDate() {
  return new Date().toISOString().split("T")[0];
}
