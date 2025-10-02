let data = [];
const todoForm = document.getElementById("todoForm");
const todoListingContainer = document.getElementById("todo-lisiting-container");

let editingId = null; 

// Load saved todos
function loadData() {
    const saved = localStorage.getItem("todos");
    if (saved) {
        data = JSON.parse(saved);
        refreshApp();
    }
}

// Save todos
function saveData() {
    localStorage.setItem("todos", JSON.stringify(data));
}

// Handle form submit
todoForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const titleElememt = e.target[0];
    const descriptionElement = e.target[1];
    const saveBtn = e.target[2];

    if (titleElememt.value === "" || descriptionElement.value === "") {
        alert("Please fill the form");
        return;
    }

    if (editingId) {
        // Update todo
        data = data.map((d) =>
            d.id === editingId
                ? { ...d, title: titleElememt.value, description: descriptionElement.value }
                : d
        );
        editingId = null;
        saveBtn.textContent = "Save Task"; 
    } else {
        // Create new todo
        const newTodo = {
            id: Date.now(),
            title: titleElememt.value,
            description: descriptionElement.value,
        };
        data.push(newTodo);
    }

    saveData();
    refreshApp();

    // Reset form
    titleElememt.value = "";
    descriptionElement.value = "";
});

// Create card UI
function createTodoCard(todo = {}) {
    const card = document.createElement("div");
    card.setAttribute("class", "bg-white rounded-lg shadow-md p-4 flex flex-col justify-between");

    card.innerHTML = `
    <div>
      <h5 class="text-lg font-semibold text-gray-800">${todo.title}</h5>
      <p class="text-gray-600 text-sm mt-1">${todo.description}</p>
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <button type="button" data-id="${todo.id}" 
        class="px-3 py-1 text-sm rounded bg-red-100 text-red-600 hover:bg-red-200 transition">Delete</button>
      <button type="button" data-id="${todo.id}" 
        class="px-3 py-1 text-sm rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition">Edit</button>
    </div>
  `;

    const ctaNodes = card.querySelectorAll("button");
    ctaNodes[0].addEventListener("click", handleDeleteClick);
    ctaNodes[1].addEventListener("click", handleEditClick);

    return card;
}

// Edit
function handleEditClick(e) {
    e.stopPropagation();
    const todo = data.find((d) => d.id === Number(e.target.dataset.id));

    todoForm[0].value = todo.title;
    todoForm[1].value = todo.description;

    editingId = todo.id; // switch to edit mode
    todoForm[2].textContent = "Update Task"; // change button text
}

// Delete
function handleDeleteClick(e) {
    e.stopPropagation();
    data = data.filter((d) => d.id !== Number(e.target.dataset.id));
    saveData();
    refreshApp();
}

// Refresh
function refreshApp() {
    todoListingContainer.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        todoListingContainer.appendChild(createTodoCard(data[i]));
    }
}

// Init
loadData();
