let input = document.querySelector(".add-task input");
let submitBtn = document.querySelector(".add-task .plus");
let tasksContainer = document.querySelector(".tasks-content");
let tasksCount = document.querySelector(".tasks-count span");
let tasksCompletedCount = document.querySelector(".tasks-completed span");

// Empty Array To Store The Tasks
let arrayOfTasks = [];

// Check if There is tasks in localStorage
if (localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(window.localStorage.getItem("tasks"));
}

// Trigger Get Data From Local Storage Function
getDataFromLocalStorage();

// Focus On Input Field
window.onload = () => {
  input.focus();

  if (tasksContainer.childElementCount == 0) {
    createNoTasksMessage();
  }
};

// Add The Task
submitBtn.addEventListener("click", () => {
  if (input.value !== "") {
    addTaskToArray(input.value); // add task to array of tasks
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "The input field can not be empty",
    });

    let noTasksMsg = document.querySelector(".no-tasks-message");
    // Check If Span Message Is Exist
    if (document.body.contains(document.querySelector(".no-tasks-message"))) {
      // Remove No Tasks Message
      noTasksMsg.remove();
    }
  }
});

// Delete the task from localStorage and page
tasksContainer.addEventListener("click", (e) => {
  // Delete
  if (e.target.classList.contains("delete")) {
    // Remove Task From Local Storage
    deleteTaskWith(e.target.parentElement.getAttribute("data-id"));
    // Remove Element From Page
    e.target.parentElement.remove();

    if (tasksContainer.childElementCount == 0) {
      // Check Number Of Tasks Inside The Container
      createNoTasksMessage();
    }
  }

  // Finish
  if (e.target.classList.contains("task-box")) {
    // Toggle Completed For The Task
    toggleTaskWith(e.target.getAttribute("data-id"));

    // Finish Task For The Page
    e.target.classList.toggle("done");
  }

  // Calculate Tasks
  calculateTasks();
});

const addTaskToArray = (taskText) => {
  // Task Data
  const task = {
    id: Date.now(),
    title: taskText,
    completed: false,
    isExistent: false,
  };

  // Push Task To Array Of Tasks
  arrayOfTasks.push(task);

  // loop on tasks to get titles
  const titles = arrayOfTasks.map((task) => task.title);

  // check if the task is already in the array
  checkTitles(titles);
  const uniqTitles = arrayOfTasks.filter(
    ({ title }, index) => !titles.includes(title, index + 1)
  );

  // Add Tasks To Page
  addElementsToPage(uniqTitles);

  // Add Tasks To Local Storage
  addDataToLocalStorage(uniqTitles);
};

function addElementsToPage(arrayOfTasks) {
  // Empty the tasks Container
  tasksContainer.innerHTML = "";
  arrayOfTasks.forEach((task) => {
    let taskSpan = document.createElement("span");
    let deleteSpan = document.createElement("span");
    let deleteText = document.createTextNode("Delete");
    taskSpan.classList.add("task-box");

    if (task.completed) {
      taskSpan.className = "task-box done";
    }

    taskSpan.setAttribute("data-id", task.id);
    taskSpan.appendChild(document.createTextNode(task.title));

    let finishAll = document.getElementById("finish-button");
    let deleteAll = document.getElementById("delete-button");

    // Delete All Task
    deleteAll.addEventListener("click", () => {
      tasksContainer.innerHTML = "";
      window.localStorage.removeItem("tasks");
      createNoTasksMessage();
      calculateTasks();
    });

    // Finish All Tasks
    finishAll.addEventListener("click", () => {
      taskSpan.classList.toggle("done");
      finish(taskSpan);

      // Calculate Tasks
      calculateTasks();
    });

    deleteSpan.appendChild(deleteText);
    deleteSpan.classList.add("delete");
    taskSpan.appendChild(deleteSpan);
    tasksContainer.appendChild(taskSpan);

    // Empty The Input
    input.value = "";
    input.focus();

    // Calculate Tasks
    calculateTasks();
  });
}

const addDataToLocalStorage = (arrayOfTasks) => {
  window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
};

function getDataFromLocalStorage() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addElementsToPage(tasks);
  }
}

const createNoTasksMessage = () => {
  // Create Message Span Element
  let msgSpan = document.createElement("span");

  // Create The Text Message
  let msgText = document.createTextNode("No Tasks To Show");

  // Add Text To The Element
  msgSpan.appendChild(msgText);

  // add Class To msg Span
  msgSpan.className = "no-tasks-message";

  // Append The Span Element To The Task Container
  tasksContainer.appendChild(msgSpan);
};

// calculate tasks
function calculateTasks() {
  // Calculate All Tasks
  tasksCount.innerHTML = document.querySelectorAll(
    ".tasks-content .task-box"
  ).length;

  // Calculate Completed Tasks
  tasksCompletedCount.innerHTML = document.querySelectorAll(
    ".tasks-content .done"
  ).length;
}

// Delete Tasks
const deleteTaskWith = (taskId) => {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
  // Update to LocalStorage
  addDataToLocalStorage(arrayOfTasks);
};

// Toggle completed for the task
const toggleTaskWith = (taskId) => {
  for (let i = 0; i < arrayOfTasks.length; i++) {
    if (arrayOfTasks[i].id == taskId) {
      arrayOfTasks[i].completed == false
        ? (arrayOfTasks[i].completed = true)
        : (arrayOfTasks[i].completed = false);
    }
  }
  // Update to LocalStorage
  addDataToLocalStorage(arrayOfTasks);
};

// Finish All Task
const finish = (taskId) => {
  for (let i = 0; i < arrayOfTasks.length; i++) {
    if (taskId.classList.contains("done")) {
      arrayOfTasks[i].completed = true;
    } else {
      arrayOfTasks[i].completed = false;
    }
  }
  // Update to LocalStorage
  addDataToLocalStorage(arrayOfTasks);
};

const checkTitles = (titles) => {
  let uniqTitle = [];
  for (let i = 0; i < titles.length; i++) {
    if (uniqTitle.indexOf(titles[i]) === -1) {
      uniqTitle.push(titles[i]);
      Swal.fire("success!", "The task has been added", "success");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "This task has already been added!",
      });
    }
  }
};
