//variables
const taskInput = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    taskBox = document.querySelector(".task-box");

let editId;
let isEditableTask = false;


//getting localstorage tot-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

// 7
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showToDoList(btn.id);

    })
})

// 2
function showToDoList(filter) {
    let liTag = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let isCompleted = todo.status == "completed" ? "checked" : "";

            if (filter == todo.status || filter =="all") {
                //template literals
                liTag += `<li class="task">
                        <label for="${id}">
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                            <p class="${isCompleted}">${todo.name}</p>
                        </label>
                        <div class="settings">
                            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                            <ul class="task-menu">
                                <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                            </ul>
                        </div>
                    </li>`;
            }

        });
    }

    //if li is empty, insert this value inside taskbox else insert span
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;

}
showToDoList("all");

// 4
function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");

    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    })
}


// 6
function editTask(taskId, taskName) {
    editId = taskId;
    isEditableTask = true;
    taskInput.value = taskName;
}

// 5
function deleteTask(deleteId, filter) {
    //removing selected task from array/todos
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showToDoList(filter);
}

// 3
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");

        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

// 7
clearAll.addEventListener("click", () => {
    todos.splice(0, todos.length);//removing all items of array/todos
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showToDoList("all");
})

// 1
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();

    if (e.key == "Enter" && userTask) {

        if (!isEditableTask) { //if isEditableTask is not true
            // if todos isn't exist, pass an empty array to todos
            if (!todos) {
                todos = [];
            }

            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo); // adding new task to todos
        } else {
            isEditableTask = false;
            todos[editId].name = userTask;
        }

        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));

        showToDoList("all");
    }
})