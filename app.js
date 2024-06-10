// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM elements
const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task-button");
const taskList = document.getElementById("task-list");

// Add a new task
const addTask = async () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    await db.collection("tasks").add({
      text: taskText,
      completed: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    taskInput.value = "";
  }
};

// Fetch and render tasks
const fetchTasks = () => {
  db.collection("tasks")
    .orderBy("createdAt", "asc")
    .onSnapshot((snapshot) => {
      taskList.innerHTML = "";
      snapshot.forEach((doc) => {
        const task = doc.data();
        const taskItem = document.createElement("li");
        taskItem.textContent = task.text;

        // Mark task as completed
        taskItem.addEventListener("click", () =>
          toggleTaskCompleted(doc.id, task.completed)
        );
        if (task.completed) {
          taskItem.style.textDecoration = "line-through";
        }

        // Delete task
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteTask(doc.id));
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);
      });
    });
};

// Toggle task completed status
const toggleTaskCompleted = async (taskId, currentStatus) => {
  await db.collection("tasks").doc(taskId).update({
    completed: !currentStatus,
  });
};

// Delete a task
const deleteTask = async (taskId) => {
  await db.collection("tasks").doc(taskId).delete();
};

// Event listener for adding tasks
addTaskButton.addEventListener("click", addTask);

// Fetch tasks initially
fetchTasks();
