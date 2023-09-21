// DRAG AND DROP

const drag = document.querySelectorAll(".task");
const drop = document.querySelectorAll(".fill-todo");

for (let i = 0; i < drag.length; i++) {
  const task = drag[i];

  task.addEventListener("dragstart", function () {
    task.classList.add("dragging");
  });

  task.addEventListener("dragend", function () {
    task.classList.remove("dragging");
  });
}

for (let i = 0; i < drop.length; i++) {
  const zone = drop[i];

  zone.addEventListener("dragover", function (e) {
    e.preventDefault();

    const bottomTask = insertAboveTask(zone, e.clientY);
    const currentTask = document.querySelector(".dragging");

    if (!bottomTask) {
      zone.appendChild(currentTask);
    } else {
      zone.insertBefore(currentTask, bottomTask);
    }
  });
}

function insertAboveTask(zone, mouseY) {
  const targetTask = zone.querySelectorAll(".task:not(.dragging)");

  let closestTask = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < targetTask.length; i++) {
    const task = targetTask[i];
    const taskPosition = task.getBoundingClientRect();
    const top = taskPosition.top;
    const offset = mouseY - top;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = task;
    }
  }

  return closestTask;
}

// CRUD

const form = document.getElementById("form");
const input = document.getElementById("input");
const todo = document.getElementById("todo");
let isEditing = false;
let editingTask = null;

//Callback
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const value = input.value;

  if (!value || isEditing) return;

  //Create
  const newTasks = document.createElement("p");
  newTasks.classList.add("task");
  newTasks.setAttribute("draggable", "true");
  newTasks.innerText = value;

  //Delete
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fas", "fa-trash");
  deleteIcon.addEventListener("click", function () {
    if (!isEditing) {
      newTasks.remove();
    }
  });

  //Edit
  const editIcon = document.createElement("i");
  editIcon.classList.add("fas", "fa-pencil");
  editIcon.addEventListener("click", function () {
    if (!isEditing) {
      const editTextarea = document.createElement("textarea");
      editTextarea.classList.add("edit-input");
      editTextarea.value = newTasks.innerText;

      newTasks.innerText = "";
      newTasks.appendChild(editTextarea);

      editTextarea.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          const editedValue = editTextarea.value;
          if (editedValue) {
            newTasks.innerText = editedValue;
          } else if (editedValue === "") {
            newTasks.remove();
          }

          // Hapus textarea
          editTextarea.remove();
          newTasks.appendChild(deleteIcon);
          newTasks.appendChild(editIcon);
          isEditing = false;
          editingTask = null;
        }
      });

      isEditing = true;
      editingTask = newTasks;

      //CSS Textarea
      editTextarea.style.width = "100%";
      editTextarea.style.height = "auto";
      editTextarea.style.overflow = "hidden";
      editTextarea.style.resize = "none";
      editTextarea.style.minHeight = "1em";
      editTextarea.style.height = editTextarea.scrollHeight + "px";
    }
  });

  newTasks.addEventListener("dragstart", function (e) {
    if (!isEditing) {
      newTasks.classList.add("dragging");
    } else {
      e.preventDefault();
    }
  });

  newTasks.addEventListener("dragend", function () {
    newTasks.classList.remove("dragging");
  });

  todo.appendChild(newTasks);
  newTasks.appendChild(deleteIcon);
  newTasks.appendChild(editIcon);

  input.value = "";
});
