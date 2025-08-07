let todos = [];
let editIndex = -1;
let deleteIndex = null;
let filterMode = 'all';

// Tambah atau edit todo
function addTodo() {
  const textInput = document.getElementById("todoInput");
  const dateInput = document.getElementById("dateInput");
  const text = textInput.value.trim();
  const date = dateInput.value;

  if (!text || !date) return alert("Please enter task and date!");

  if (editIndex === -1) {
    todos.push({ text, date, completed: false });
  } else {
    todos[editIndex].text = text;
    todos[editIndex].date = date;
    editIndex = -1;
    document.querySelector(".addBtn").innerText = "+";
  }

  textInput.value = "";
  dateInput.value = "";
  renderTodos();
}

// Tampilkan daftar todos
function renderTodos() {
  const list = document.getElementById("todoList");
  const search = document.getElementById("searchInput").value.toLowerCase();
  list.innerHTML = "";

  let filtered = todos.filter(todo => todo.text.toLowerCase().includes(search));

  if (filterMode === 'pending') {
    filtered = filtered.filter(todo => !todo.completed);
  } else if (filterMode === 'completed') {
    filtered = filtered.filter(todo => todo.completed);
  }

  if (filtered.length === 0) {
    list.innerHTML = '<tr><td colspan="4" class="not-found">No tasks found</td></tr>';
  }

  filtered.forEach((todo, index) => {
    const highlightedText = highlightKeyword(todo.text, search);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${highlightedText}</td>
      <td>${todo.date}</td>
      <td><span class="status ${todo.completed ? 'completed' : 'pending'}">${todo.completed ? 'Completed' : 'Pending'}</span></td>
      <td class="actions">
        <button class="add" onclick="addTodo()">+</button>
        <button class="edit" onclick="editTodo(${index})">✏</button>
        <button class="complete" onclick="toggleTodo(${index})">✔</button>
        <button class="delete" onclick="deleteTodo(${index})">🗑</button>
      </td>`;
    list.appendChild(row);
  });

  updateStats();
}

function highlightKeyword(text, keyword) {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, `<span class="highlight">$1</span>`);
}

function editTodo(index) {
  const todo = todos[index];
  document.getElementById("todoInput").value = todo.text;
  document.getElementById("dateInput").value = todo.date;
  editIndex = index;
  document.querySelector(".addBtn").innerText = "Update";
  document.getElementById("todoInput").focus();
}

function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  renderTodos();
}

function deleteTodo(index) {
  deleteIndex = index;
  const todo = todos[index];
  document.getElementById("modalText").innerText = `Yakin ingin menghapus tugas: "${todo.text}"?`;
  document.getElementById("confirmModal").style.display = "flex";
}

function deleteAll() {
  document.getElementById("confirmDeleteAllModal").style.display = "flex";
}

function updateStats() {
  document.getElementById("totalTasks").innerText = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = todos.length - completed;
  document.getElementById("completedTasks").innerText = completed;
  document.getElementById("pendingTasks").innerText = pending;
  const progress = todos.length ? Math.round((completed / todos.length) * 100) : 0;
  document.getElementById("progress").innerText = progress + "%";
}

// Tombol batal hapus satu
document.getElementById("cancelBtn").addEventListener("click", () => {
  document.getElementById("confirmModal").style.display = "none";
  deleteIndex = null;
});

// Tombol konfirmasi hapus satu
document.getElementById("confirmBtn").addEventListener("click", () => {
  if (deleteIndex !== null) {
    if (editIndex === deleteIndex) {
      editIndex = -1;
      document.getElementById("todoInput").value = "";
      document.getElementById("dateInput").value = "";
      document.querySelector(".addBtn").innerText = "+";
    }
    todos.splice(deleteIndex, 1);
    renderTodos();
    document.getElementById("confirmModal").style.display = "none";
    deleteIndex = null;
  }
});

// Tombol batal hapus semua
document.getElementById("cancelDeleteAllBtn").addEventListener("click", () => {
  document.getElementById("confirmDeleteAllModal").style.display = "none";
});

// Tombol konfirmasi hapus semua
document.getElementById("confirmDeleteAllBtn").addEventListener("click", () => {
  todos = [];
  editIndex = -1;
  document.getElementById("todoInput").value = "";
  document.getElementById("dateInput").value = "";
  document.querySelector(".addBtn").innerText = "+";
  renderTodos();
  document.getElementById("confirmDeleteAllModal").style.display = "none";
});

// Toggle filter dropdown
function toggleFilterDropdown() {
  const dropdown = document.getElementById("filterDropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Set filter mode
function setFilter(mode) {
  filterMode = mode;
  renderTodos();
  document.getElementById("filterDropdown").style.display = "none";
}

// Klik luar dropdown untuk menutup
document.addEventListener("click", function (e) {
  const dropdown = document.getElementById("filterDropdown");
  const button = document.querySelector(".filter-button");
  if (!dropdown.contains(e.target) && !button.contains(e.target)) {
    dropdown.style.display = "none";
  }
});
