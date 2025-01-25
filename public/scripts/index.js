const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoListUL = document.getElementById("todo-list");

const authToken = localStorage.getItem("authToken");
const userId = localStorage.getItem("userId");

let allTodos = [];

async function main() {
  displayUserInfo();
  allTodos = await getTodos();
  updateTodoList();
}

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo();
});

document.getElementById("log-out-btn").addEventListener("click", function (e) {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");

  window.location.href = "./log-in.html";
});

async function displayUserInfo() {
  try {
    const response = await fetch(`${config.API_BASE_URL}/get-user-info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        id: `${localStorage.getItem("userId")}`,
      },
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById("username").innerText = result.data.username;
      document.getElementById("email").innerText = result.data.email;
    } else {
      console.log(result.message);
      window.location.href = "./log-in.html";
    }
  } catch (error) {}
}

async function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    try {
      const response = await fetch(`${config.API_BASE_URL}/add-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          id: `${localStorage.getItem("userId")}`,
        },
        body: JSON.stringify({ title: todoText }),
      });

      const result = await response.json();

      if (response.ok) {
        const todoObject = result.data;
        allTodos.push(todoObject);
        updateTodoList();
        todoInput.value = "";
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.error("Error during task upload:", error);
    }
  }
}

function updateTodoList() {
  todoListUL.innerHTML = "";
  allTodos.forEach((todo, todoIndex) => {
    todoItem = createTodoItem(todo, todoIndex);
    todoListUL.append(todoItem);
  });
}

function createTodoItem(todo, todoIndex) {
  const todoId = todo._id;
  const todoLI = document.createElement("li");
  const todoText = todo.title;
  todoLI.className = "todo";

  todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}">
        <label class="custom-checkbox" for="${todoId}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
        </label>
        <label for="${todoId}" class="todo-text">
            ${todoText}
        </label>
        <button class="delete-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </button>
    `;

  const deleteButton = todoLI.querySelector(".delete-button");
  deleteButton.addEventListener("click", () => {
    deleteTodoItem(todoIndex);
  });

  const checkbox = todoLI.querySelector("input");
  checkbox.addEventListener("change", () => {
    checkCompleted(todoIndex, checkbox.checked);
  });

  checkbox.checked = todo.isCompleted;
  return todoLI;
}

async function deleteTodoItem(todoIndex) {
  try {
    const response = await fetch(`${config.API_BASE_URL}/delete-task`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        id: localStorage.getItem("userId"),
        taskid: allTodos.at(todoIndex)._id,
      },
    });
    const result = await response.json();
    if (response.ok) {
      allTodos = allTodos.filter((_, i) => i !== todoIndex);
      updateTodoList();
    } else {
      console.log(result);
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

async function checkCompleted(todoIndex, checkValue) {
  try {
    const response = await fetch(`${config.API_BASE_URL}/mark-completed`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        id: localStorage.getItem("userId"),
        taskid: allTodos.at(todoIndex)._id,
      },
      body: JSON.stringify({ mark: checkValue }),
    });

    const result = await response.json();

    if (response.ok) {
      allTodos[todoIndex].isCompleted = checkValue;
    } else {
      console.log(result);
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

async function getTodos() {
  try {
    const response = await fetch(`${config.API_BASE_URL}/get-all-tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`, // JWT token
        id: userId, // User ID
      },
    });
    const result = await response.json();
    if (result.status === "Success") {
      return result.data;
    } else {
      console.error("Failed to fetch wishlist items");
    }
  } catch (error) {
    console.error("Error fetching wishlist:", error);
  }
}

//main
if (!(authToken && userId)) {
  window.location.href = "./log-in.html";
} else {
  main();
}
