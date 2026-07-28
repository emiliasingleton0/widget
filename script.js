const STORAGE_KEYS = {
  tasks: "mochi.tasks",
  notes: "mochi.notes",
  goal: "mochi.focusGoal",
  pinned: "mochi.pinned"
};

const messages = [
  "one small task at a time!",
  "you are doing better than you think ♡",
  "drink some water, okay?",
  "tiny progress is still progress!",
  "your desk buddy believes in you ୨୧"
];

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const clearCompleted = document.querySelector("#clear-completed");
const notesArea = document.querySelector("#notes-area");
const noteCount = document.querySelector("#note-count");
const clearNotes = document.querySelector("#clear-notes");
const focusGoal = document.querySelector("#focus-goal");
const pinButton = document.querySelector("#pin-button");
const minimizeButton = document.querySelector("#minimize-button");
const closeButton = document.querySelector("#close-button");

let tasks = readJSON(STORAGE_KEYS.tasks, []);
let isPinned = readJSON(STORAGE_KEYS.pinned, false);

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function setDateAndGreeting() {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "good morning" :
    hour < 18 ? "good afternoon" :
    "good evening";

  document.querySelector("#greeting").textContent = `${greeting}, emi ♡`;
  document.querySelector("#date-label").textContent =
    now.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric"
    });

  document.querySelector("#tiny-message").textContent =
    messages[Math.floor(Math.random() * messages.length)];
}

function switchTab(tabName) {
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabName);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${tabName}-panel`);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "your list is empty... add a tiny task ♡";
    taskList.appendChild(empty);
  } else {
    tasks.forEach((task) => {
      const item = document.createElement("li");
      item.className = `task-item${task.done ? " completed" : ""}`;

      const checkbox = document.createElement("input");
      checkbox.className = "task-check";
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.setAttribute("aria-label", `Mark ${task.text} complete`);
      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        saveTasks();
      });

      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.text;

      const remove = document.createElement("button");
      remove.className = "delete-task";
      remove.type = "button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Delete ${task.text}`);
      remove.addEventListener("click", () => {
        tasks = tasks.filter((candidate) => candidate.id !== task.id);
        saveTasks();
      });

      item.append(checkbox, text, remove);
      taskList.appendChild(item);
    });
  }

  const completed = tasks.filter((task) => task.done).length;
  taskCount.textContent = `${completed}/${tasks.length} done`;
}

function saveTasks() {
  saveJSON(STORAGE_KEYS.tasks, tasks);
  renderTasks();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.unshift({
    id: crypto.randomUUID(),
    text,
    done: false
  });

  taskInput.value = "";
  saveTasks();
});

clearCompleted.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
});

notesArea.value = localStorage.getItem(STORAGE_KEYS.notes) || "";
focusGoal.value = localStorage.getItem(STORAGE_KEYS.goal) || "";

function updateNoteCount() {
  noteCount.textContent = `${notesArea.value.length}/1200`;
}

notesArea.addEventListener("input", () => {
  localStorage.setItem(STORAGE_KEYS.notes, notesArea.value);
  updateNoteCount();
});

clearNotes.addEventListener("click", () => {
  notesArea.value = "";
  localStorage.removeItem(STORAGE_KEYS.notes);
  updateNoteCount();
});

focusGoal.addEventListener("input", () => {
  localStorage.setItem(STORAGE_KEYS.goal, focusGoal.value);
});

pinButton.classList.toggle("active", isPinned);
window.desktopAPI.setAlwaysOnTop(isPinned);

pinButton.addEventListener("click", () => {
  isPinned = !isPinned;
  saveJSON(STORAGE_KEYS.pinned, isPinned);
  pinButton.classList.toggle("active", isPinned);
  window.desktopAPI.setAlwaysOnTop(isPinned);
});

minimizeButton.addEventListener("click", () => {
  window.desktopAPI.minimize();
});

closeButton.addEventListener("click", () => {
  window.desktopAPI.close();
});

// Focus timer
const timerDisplay = document.querySelector("#timer-display");
const timerLabel = document.querySelector("#timer-label");
const timerStart = document.querySelector("#timer-start");
const timerReset = document.querySelector("#timer-reset");
const presetButtons = document.querySelectorAll(".preset");

let selectedMinutes = 25;
let secondsRemaining = selectedMinutes * 60;
let timerId = null;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(secondsRemaining);
  document.title = timerId
    ? `${formatTime(secondsRemaining)} · Mochi`
    : "Mochi Desk Buddy";
}

function stopTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
  timerStart.textContent = "start";
}

function completeTimer() {
  stopTimer();
  timerLabel.textContent = "all done! ♡";
  timerDisplay.textContent = "00:00";

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.frequency.value = 660;
  gain.gain.setValueAtTime(0.08, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.55
  );
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.55);
}

timerStart.addEventListener("click", () => {
  if (timerId) {
    stopTimer();
    timerLabel.textContent = "paused";
    return;
  }

  if (secondsRemaining <= 0) {
    secondsRemaining = selectedMinutes * 60;
  }

  timerLabel.textContent =
    selectedMinutes === 5 ? "little break" : "focus time";
  timerStart.textContent = "pause";

  timerId = setInterval(() => {
    secondsRemaining -= 1;
    updateTimerDisplay();

    if (secondsRemaining <= 0) {
      completeTimer();
    }
  }, 1000);
});

timerReset.addEventListener("click", () => {
  stopTimer();
  secondsRemaining = selectedMinutes * 60;
  timerLabel.textContent =
    selectedMinutes === 5 ? "little break" : "focus time";
  updateTimerDisplay();
});

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedMinutes = Number(button.dataset.minutes);
    secondsRemaining = selectedMinutes * 60;
    stopTimer();
    timerLabel.textContent =
      selectedMinutes === 5 ? "little break" : "focus time";
    presetButtons.forEach((candidate) =>
      candidate.classList.toggle("active", candidate === button)
    );
    updateTimerDisplay();
  });
});

setDateAndGreeting();
renderTasks();
updateNoteCount();
updateTimerDisplay();
