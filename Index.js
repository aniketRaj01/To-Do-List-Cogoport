let todo = [
    {
        title: "brush your teeth",
        id: uuidv4(),
        priority: "low",
        category: "general",
        complete: true,
        subtasks: [],
        dueDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        created_at: new Date(),
    },
    {
        title: "breakfast",
        id: uuidv4(),
        priority: "low",
        category: "general",
        dueDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        complete: false,
        subtasks: [],
        created_at: new Date()
    }
]
let existingItems = JSON.parse(localStorage.getItem("todo"));
console.log(existingItems)
if(existingItems) todo = existingItems

const root = document.getElementById("root");
function uuidv4() {
    return Math.random().toString(16).slice(2);
}
function todoSchema(title, priority, dueDate, category, subtasks){

    let todo = {
        id: uuidv4(),
        title: title,
        priority: priority,
        category: category,
        complete: false,
        subtasks: subtasks,
        dueDate: dueDate,
        created_at: new Date(),
        archive: false,
    }

    return todo;
}
function addToDo(){
    const title = document.getElementById("todo-title").value;
    const priority = document.getElementById("priority").value;
    const category = document.getElementById("category").value;
    const deadline = document.getElementById("due-date").value;
    let dueDate;
    if(!deadline){
        dueDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    }else{
        dueDate = new Date(deadline)
    }
    const subtasks = [];
    const todoItem = todoSchema(title, priority, dueDate, category, subtasks);
    console.log(todoItem)
    todo.push(todoItem)
    render(false, false)
}

function deleteToDo(event){
    let id = event.target.name
    for(let i = 0; i<todo.length; i++){
        if(todo[i].id == id) todo.splice(i, 1);
    }
    render(false, false)
}

function editToDo(event){
    let id = event.target.name;
    const val = document.getElementById(id).value;
    for(let i = 0; i<todo.length; i++){
        if(todo[i].id === id) {
            todo[i].title = val;
            break;
        }
    }
    render(false, false)
    alert("Changes Saved!")
}

function toggleComplete(event){
    let id = event.target.name;
    for(let i = 0; i<todo.length; i++) if(id === todo[i].id) todo[i].complete = !todo[i].complete;
    render(false, false)
}

function toggleArchive(event){
    let id = event.target.name;
    for(let i = 0; i<todo.length; i++) if(id === todo[i].id) todo[i].archive = !todo[i].archive;
    viewArchive()
}

function viewArchive(){
    let archiveCheck = document.getElementById("archive").checked;
    if(archiveCheck) render(false, true)
    else render(false, false)
}

function sortToDo(){
    let param = document.getElementById("sort").value;
    if(param === "date-added"){
        todo.sort(function(t1, t2){
            return new Date(t2.created_at) - new Date(t1.created_at);
        })
    }
    else if(param ==="due-date"){
        todo.sort(function(t1, t2){
            return  new Date(t1.dueDate) - new Date(t2.dueDate);
        })
    }
    else if(param === "priority"){
        todo = [...todo.filter((item)=>{return item.priority === "high"}), ...todo.filter((item)=>{return item.priority === "medium"}), ...todo.filter((item)=>{return item.priority === "low"})];
    }
    else if(param === "complete"){
        todo = [...todo.filter((item)=>{return item.complete}), ...todo.filter((item)=>{return !item.complete})];
    }
    else if(param === "incomplete"){
        todo = [...todo.filter((item)=>{return !item.complete}), ...todo.filter((item)=>{return item.complete})];
    }
    render(true, false)
}

function searchToDo(){
let txt = document.getElementById("search").value, arr =[];
let archiveCheck = document.getElementById("archive").checked;
if(!txt) return;
for(let i = 0; i<todo.length; i++){
    if(todo[i].title.search(txt) != -1) {
        arr.push(todo[i]);
        todo.splice(i, 1);
    }
}

todo = [...arr, ...todo];
render(true, archiveCheck)
}

function render(isTemp, isArchive){
    let str = "";
    for(let i = 0; i<todo.length; i++){
        if(!isArchive && !todo[i].archive)
        str += `
        <div class="card" >
            <div class="card-body">
            ${
                todo[i].complete ? `<h5 class="card-title">Task Completed!</h5>` : ""
            }
            
            <textarea cols="60" row="50" style="font-weight: bold;" class="card-title ${todo[i].complete ? 'complete' : ''}" id="${todo[i].id}">${todo[i].title}</textarea>
            <h6 class="card-subtitle mb-2 text-muted ${todo[i].complete ? 'complete' : ''}"><b>Priority:</b> ${todo[i].priority} </h6>
            <h6 class="card-subtitle mb-2 text-muted ${todo[i].complete ? 'complete' : ''}"><b>Category:</b> ${todo[i].category}</h6>
            ${
                !todo[i].complete ? `<h6 class="card-subtitle mb-2 text-muted"><b>DeadLine:</b> ${new Date(todo[i].dueDate)}</h6>` : ""
            }
            <button name="${todo[i].id}" onclick="deleteToDo(event)" class="btn btn-danger">Delete</button>
            <button name="${todo[i].id}" onclick="editToDo(event)" class="btn btn-primary">Save Changes</button>
            <button name="${todo[i].id}" onclick="toggleComplete(event)" class="btn btn-success">Mark ${todo[i].complete ? "Incomplete" : "Complete"}</button>
            <button name="${todo[i].id}" onclick="toggleArchive(event)" class="btn btn-dark">Archive!</button>
            </div>
        </div>
        `
        else if(isArchive && todo[i].archive){
            str += `
        <div class="card" >
            <div class="card-body">
            ${
                todo[i].complete ? `<h5 class="card-title">Task Completed!</h5>` : ""
            }
            
            <textarea cols="60" style="font-weight: bold;" class="card-title ${todo[i].complete ? 'complete' : ''}" id="${todo[i].id}">${todo[i].title}</textarea>
            <h6 class="card-subtitle mb-2 text-muted ${todo[i].complete ? 'complete' : ''}"><b>Priority:</b> ${todo[i].priority} </h6>
            <h6 class="card-subtitle mb-2 text-muted ${todo[i].complete ? 'complete' : ''}"><b>Category:</b> ${todo[i].category}</h6>
            ${
                !todo[i].complete ? `<h6 class="card-subtitle mb-2 text-muted"><b>DeadLine:</b> ${new Date(todo[i].dueDate)}</h6>` : ""
            }
            <button name="${todo[i].id}" onclick="deleteToDo(event)" class="btn btn-danger">Delete</button>
            <button name="${todo[i].id}" onclick="toggleComplete(event)" class="btn btn-success">Mark ${todo[i].complete ? "Incomplete" : "Complete"}</button>
            <button name="${todo[i].id}" onclick="toggleArchive(event)" class="btn btn-dark">Remove from archive!</button>
            </div>
        </div>
        `
        }


    }
    root.innerHTML=str;
    if(!isTemp)
    localStorage.setItem("todo", JSON.stringify(todo))
    console.log(todo)
}

render(true, false)