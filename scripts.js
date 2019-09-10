let todoTab = document.getElementById('tab-todo');
let profileTab = document.getElementById('tab-profile');
let settingsTab = document.getElementById('tab-settings');

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

let addBtn = document.getElementById('btn-add');
let todoInput = document.getElementById('inp-todo');
let todoTable = document.getElementById('table-todo');

let todoControls = document.getElementById('tab-controls');
let todoList = document.getElementById('todo-list');

function addTodoToUi(todoItem){
    let row = document.createElement('tr');
    if(todoItem.title){
        let todoElement = getTodoElement(todoItem);
        todoElement.setAttribute("todo-id", todoItem.id);
        row.appendChild(todoElement);
        let deleteElement = getDelete();
        deleteElement.addEventListener('click', _=> deleteTodoItem(todoElement));
        row.appendChild(deleteElement);

        todoTable.appendChild(row);

        let option = document.createElement('option');
        option.textContent = todoItem.title;
        todoList.appendChild(option);
    }
}

function getTodoElement(todoItem){
    let todoElement = document.createElement('td');

    let todoTitle = document.createElement('span');
    todoTitle.classList.add('todo-title');
    let editTitle = getEdit();
    let titleDiv = document.createElement('div');
    titleDiv.appendChild(todoTitle);
    titleDiv.appendChild(editTitle);
    
    let todoDescription = document.createElement('span');
    todoDescription.classList.add('todo-description');
    let editDescription = getEdit();
    let descriptionDiv = document.createElement('div');
    descriptionDiv.appendChild(todoDescription);
    descriptionDiv.appendChild(editDescription);
    descriptionDiv.classList.add('div-description');
    
    todoTitle.innerText = todoItem.title;
    todoDescription.innerText = todoItem.description;
    
    todoElement.appendChild(titleDiv);
    todoElement.appendChild(document.createElement('br'))
    todoElement.appendChild(descriptionDiv);
    
    return todoElement;
}

function readTodoInput(){
    let contents = todoInput.value;
    todoInput.value = '';
    todoInput.focus();
    return contents;
}

function getEdit(){
    let edit = document.createElement('span');
    edit.classList.add('btn-edit');
    edit.textContent = 'Edit';
    let editToggle = function(){
        let editItem = edit.parentElement.firstChild;
        if(edit.textContent == 'Edit'){
            let content = editItem.textContent;
            editItem.textContent = '';
            let inp = document.createElement('input');
            inp.value = content;
            inp.focus();
            inp.addEventListener('change', editToggle);
            inp.classList.add('edit-box');
            editItem.appendChild(inp);
            edit.textContent = 'Save';
        }else{
            let content = editItem.firstChild.value;
           
            let getPatchItem = function(editItem){
                if(editItem.classList.contains('todo-title'))
                    return {
                        id: editItem.parentElement.parentElement.getAttribute('todo-id'),
                        title: content
                    };
                else if(editItem.classList.contains('todo-description'))
                    return {
                        id: editItem.parentElement.parentElement.getAttribute('todo-id'),
                        description: content
                    }
                else return null;
            }
            patchTodo(getPatchItem(editItem))

            editItem.textContent = content;
            edit.textContent = 'Edit';
        }
    }
    edit.addEventListener('click', editToggle);
    return edit;
}

function getDelete(){
    let deleteElement = document.createElement('td');
    deleteElement.textContent = 'Delete';
    return deleteElement;
}

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

//Server interaction
var xhr = new XMLHttpRequest();
var server_url = 'http://localhost:8080/';

window.onload = loadTodoItems;

todoInput.addEventListener('change', postTodo);
addBtn.addEventListener('click', postTodo);

function logResponse(response){
    console.log(`${response.status} - ${response.message}`);
}

function postTodo(){
    xhr.open('POST', server_url + 'todo', true);
    xhr.onload = function() {
        if(this.status == 201){
            let response = JSON.parse(this.responseText);
            logResponse(response);
            addTodoToUi(response.data);
        }else
            logResponse(JSON.parse(xhr.responseText))
    };
    xhr.onerror = (e) => console.log(e.message);
    
    xhr.setRequestHeader('Content-Type', 'application/json')
    let requestBody = {title: readTodoInput()};
    console.log(requestBody);
    xhr.send(JSON.stringify(requestBody));
}

function loadTodoItems(){
    xhr.open('GET', server_url + 'todos', true);
    xhr.onload = function() {
        if(this.status == 200){
            let response = JSON.parse(this.responseText);
            logResponse(response);
            response.data.forEach(todoItem => addTodoToUi(todoItem));
        }else
            logResponse(JSON.parse(xhr.responseText))
    };
    xhr.onerror = (e) => console.log(e.message);
    xhr.send();
}

function deleteTodoItem(todoElement){
    console.log(todoElement.getAttribute('todo-id'));
    xhr.open('DELETE', server_url + 'todo/' + todoElement.getAttribute('todo-id'), true);
    xhr.onload = function() {
        if(this.status == 200){
            let response = JSON.parse(this.responseText);
            logResponse(response);
            if(response.status == 'success')
                todoElement.parentElement.remove();;
        }else
            logResponse(JSON.parse(xhr.responseText))
    };
    xhr.onerror = (e) => console.log(e.message);
    xhr.send();
}

function patchTodo(todoItem){
    xhr.open('PATCH', server_url + 'todo/' + todoItem.id, true);
    xhr.onload = function() {
        if(this.status == 200){
            let response = JSON.parse(this.responseText);
            logResponse(response);
        }else
            logResponse(JSON.parse(xhr.responseText))
    };
    xhr.onerror = (e) => console.log(e.message);
    
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(todoItem));
}