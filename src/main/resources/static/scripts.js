
function openTaskForm() {
    document.getElementById('task-form').style.display = 'block';
}

function closeTaskForm() {
    document.getElementById('task-form').style.display = 'none';

    const editingTaskBox = document.querySelector('.task-box.editing');
    if (editingTaskBox) {
        editingTaskBox.classList.remove('editing');
    }
}

function saveTask() {
    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('dueDate').value;

    const task = {
        name: taskName,
        description: taskDescription,
        dueDate: dueDate
    };

    const editedTaskId = document.querySelector('.task-box.editing')?.id;

    fetch(`http://localhost:8080/tasks${editedTaskId ? `/${editedTaskId}` : ''}`, {
        method: editedTaskId ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
    .then(response => response.json())
    .then(updatedTask => {
        if (editedTaskId) {

            updateTaskInUI(updatedTask);
        } else {

            displayTask(updatedTask);
        }

        closeTaskForm();
    })
    .catch(error => console.error('Error adding/updating task:', error));
}

function updateTaskInUI(updatedTask) {
    // Find the task element in the UI by ID
    const taskElement = document.getElementById(updatedTask.id);

    if (taskElement) {

        taskElement.innerHTML = `
            <p><strong>Name:</strong> ${updatedTask.name}</p>
            <p><strong>Description:</strong> ${updatedTask.description}</p>
            <p><strong>Due Date:</strong> ${updatedTask.dueDate}</p>
            <button class="rounded-button" onclick="editTask(${updatedTask.id})">Edit</button>
            <button class="rounded-button" onclick="deleteTask(${updatedTask.id})">Delete</button>
        `;

        taskElement.classList.remove('editing');
    } else {
        console.error('Task element not found in the UI');
    }
}

function displayTask(task) {
    const contentDiv = document.getElementById('content');

    const taskBox = document.createElement('div');
    taskBox.className = 'task-box';
    taskBox.setAttribute('id', task.id);
    taskBox.innerHTML = `
        <p><strong>Name:</strong> ${task.name}</p>
        <p><strong>Description:</strong> ${task.description}</p>
        <p><strong>Due Date:</strong> ${task.dueDate}</p>
        <button class="rounded-button" onclick="editTask(${task.id})">Edit</button>
        <button class="rounded-button" onclick="deleteTask(${task.id})">Delete</button>
    `;

    contentDiv.appendChild(taskBox);
}


function editTask(taskId) {
    fetch(`http://localhost:8080/tasks/${taskId}`)
        .then(response => response.json())
        .then(existingTask => {

            document.getElementById('taskName').value = existingTask.name;
            document.getElementById('taskDescription').value = existingTask.description;
            document.getElementById('dueDate').value = existingTask.dueDate;

            openTaskForm();

            const taskBox = document.getElementById(taskId);
            if (taskBox) {
                taskBox.classList.add('editing');
            }
        })
        .catch(error => console.error('Error fetching task details:', error));
}

function deleteTask(taskId) {

    fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {

            const taskElement = document.getElementById(taskId);
            if (taskElement) {
                taskElement.remove();
            } else {
                console.error('Task element not found in the UI');
            }
        } else {
            console.error('Error deleting task:', response.status);
        }
    })
    .catch(error => console.error('Error deleting task:', error));
}

function fetchAllTasks() {
    fetch('http://localhost:8080/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => {
                displayTask(task);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

$ (function() {
    $("#dueDate").datepicker({
        dateFormat: "dd/mm/yy"
    });
});

window.onload = function () {
    fetchAllTasks();
};

