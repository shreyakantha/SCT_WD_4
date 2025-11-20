let lists = JSON.parse(localStorage.getItem('todoLists')) || {};
function saveData() {
    localStorage.setItem('todoLists', JSON.stringify(lists));
}

function updateTime() {
    const now = new Date();
    document.getElementById('today').innerText = now.toDateString();
    document.getElementById('currentTime').innerText = now.toLocaleTimeString();
}

function loadWeekDates() {
    const container = document.getElementById('weekDates');
    container.innerHTML = '';
    const weekdays = ['s','m','t','w','t','f','s'];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayNumber = date.getDate();
        const dayLetter = weekdays[date.getDay()];
        const block = document.createElement('div');
        block.className = 'day-block';
        const num = document.createElement('div');
        num.className = 'day-number ' + (i === 0 ? 'day-active' : 'day-inactive');
        num.textContent = dayNumber;
        const letter = document.createElement('div');
        letter.textContent = dayLetter;
        block.appendChild(num);
        block.appendChild(letter);
        container.appendChild(block);
    }
}

function addList() {
    const nameInput = document.getElementById('newListName');
    const name = nameInput.value.trim();
    if (!name) return;
    if (!lists[name]) lists[name] = [];
    nameInput.value = '';
    updateUI();
    saveData();
}

function addTask() {
    const select = document.getElementById('listSelect');
    const listName = select.value;
    const name = document.getElementById('taskName').value.trim();
    const due = document.getElementById('taskDue').value;
    if (!listName || !name) return;
    lists[listName].push({
        id: Date.now(),
        name,
        due,
        completed: false
    });
    document.getElementById('taskName').value = '';
    document.getElementById('taskDue').value = '';
    updateUI();
    saveData();
}

function toggleComplete(listName, id) {
    const task = lists[listName].find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    updateUI();
    saveData();
}

function deleteTask(listName, id) {
    lists[listName] = lists[listName].filter(t => t.id !== id);
    updateUI();
    saveData();
}

function editTask(listName, id) {
    const task = lists[listName].find(t => t.id === id);
    if (!task) return;
    const newName = prompt('Edit task name', task.name);
    if (newName === null) return;
    const newDue = prompt('Edit due date/time (YYYY-MM-DDTHH:MM)', task.due || '');
    if (newName !== null) task.name = newName.trim();
    if (newDue !== null) task.due = newDue;
    updateUI();
    saveData();
}

function updateUI() {
    const listsDiv = document.getElementById('lists');
    const select = document.getElementById('listSelect');
    listsDiv.innerHTML = '';
    select.innerHTML = '';
    const listNames = Object.keys(lists);
    if (listNames.length === 0) {
        const placeholder = document.createElement('option');
        placeholder.textContent = '— create a list first —';
        placeholder.disabled = true;
        placeholder.selected = true;
        select.appendChild(placeholder);
    } else {
        listNames.forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            select.appendChild(opt);
        });
    }
    listNames.forEach(listName => {
        const heading = document.createElement('h3');
        heading.textContent = listName;
        heading.style.marginTop = '14px';
        heading.style.marginBottom = '8px';
        listsDiv.appendChild(heading);
        lists[listName].forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task';
            const left = document.createElement('div');
            left.className = 'left-section';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'checkbox';
            cb.checked = Boolean(task.completed);
            cb.addEventListener('change', () => toggleComplete(listName, task.id));
            const title = document.createElement('span');
            title.textContent = task.name;
            if (task.completed) title.className = 'completed-text';
            left.appendChild(cb);
            left.appendChild(title);
            const right = document.createElement('div');
            right.style.display = 'flex';
            right.style.flexDirection = 'column';
            right.style.alignItems = 'flex-end';
            right.style.gap = '6px';
            const timeBox = document.createElement('div');
            timeBox.className = 'time-box';
            timeBox.textContent = task.due
            ? new Date(task.due).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';
            const controls = document.createElement('div');
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.style.padding = '6px 8px';
            editBtn.style.fontSize = '13px';
            editBtn.style.marginRight = '6px';
            editBtn.addEventListener('click', () => editTask(listName, task.id));
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.style.padding = '6px 8px';
            delBtn.style.fontSize = '13px';
            delBtn.style.background = '#d44';
            delBtn.addEventListener('click', () => deleteTask(listName, task.id));
            controls.appendChild(editBtn);
            controls.appendChild(delBtn);
            right.appendChild(timeBox);
            right.appendChild(controls);
            taskDiv.appendChild(left);
            taskDiv.appendChild(right);
            listsDiv.appendChild(taskDiv);
        });
        if (lists[listName].length === 0) {
            const hint = document.createElement('div');
            hint.style.color = '#7a8694';
            hint.style.fontSize = '13px';
            hint.style.marginBottom = '6px';
            hint.textContent = 'No tasks yet.';
            listsDiv.appendChild(hint);
        }
    });
}
document.getElementById('addListBtn').addEventListener('click', addList);
document.getElementById('addTaskBtn').addEventListener('click', addTask);

updateTime();
loadWeekDates();
updateUI();

setInterval(updateTime, 1000);
setInterval(loadWeekDates, 1000 * 60 * 10);