let todoTab = document.getElementById('tab-todo');
let profileTab = document.getElementById('tab-profile');
let settingsTab = document.getElementById('tab-settings');

let addBtn = document.getElementById('btn-add');
let todoInput = document.getElementById('inp-todo');
let todoTable = document.getElementById('table-todo');

let todoControls = document.getElementById('tab-controls');
let todoList = document.getElementById('todo-list');


addBtn.addEventListener('click', _ => {
    let row = document.createElement('tr');

    let todo = readInput();
    let td = document.createElement('td');
    td.textContent = todo;
    row.appendChild(td);
    row.appendChild(getEdit());
    row.appendChild(getDelete());

    todoTable.appendChild(row);

    let option = document.createElement('option');
    todoList.appendChild(option);
});


function readInput(){
    if(todoInput.value)
        return todoInput.value;
}

function getEdit(){
    let edit = document.createElement('td');
    edit.textContent = 'Edit';
    edit.addEventListener('click', _ => {
        let todoName = edit.parentElement.firstChild;
        if(edit.textContent == 'Edit'){
            todoName.textContent = '';
            let inp = document.createElement('input');
            todoName.appendChild(inp);
            edit.textContent = 'Save';
        }else{
            let inpVal = todoName.firstChild.value;
            todoName.textContent = inpVal;
            edit.textContent = 'Edit';
        }
    });
    return edit;
}

function getDelete(){
    let del = document.createElement('td');
    del.textContent = 'Delete';
    del.addEventListener('click', _ => {
         todoTable.removeChild(del.parentElement);
    });
    return del;
}


todoTab.addEventListener('click', _ => {
    if(!isActive(todoTab)){
        todoTab.classList.add('active');
        removeActiveClass(profileTab);
        removeActiveClass(settingsTab);
    }

    if(isHidden(todoControls))
        show(todoControls);

    let content = {
        title: "Todo List",
        message: "There is no message.",
    }
     setRightContent(content);
});


profileTab.addEventListener('click', _ => {
    if(!isActive(profileTab)){
        profileTab.classList.add('active');
        removeActiveClass(todoTab);
        removeActiveClass(settingsTab);
    }

    hide(todoControls);

    let content = {
        title: "Profile",
        message: "You will be able to see your profile details, If I am not boared of this project."
    }

     setRightContent(content);
});


settingsTab.addEventListener('click', _ => {
    if(!isActive(settingsTab)){
        settingsTab.classList.add('active');
        removeActiveClass(todoTab);
        removeActiveClass(profileTab);
    }

    hide(todoControls);

    let content = {
        title: "Settings",
        message: "You can set all you want, nothing will change bro."
    }

     setRightContent(content);
});

function isActive(element){
    return element.classList.contains('active');
}

function removeActiveClass(element){
    if(isActive(element))
        element.classList.remove('active');
}

function setRightContent(content){
    document.getElementById('title').textContent = content.title;
    document.getElementById('message').textContent = content.message;
}

function isHidden(element){
    return element.classList.contains('hide');
}

function hide(element){
    element.classList.add('hide');
}

function show(element){
    element.classList.remove('hide');
}