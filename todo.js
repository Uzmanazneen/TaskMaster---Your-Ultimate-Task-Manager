let todo = document.querySelector("#todo");
let todoList = document.querySelector("#todos");
let form = document.querySelector("#todo-form");
let todoNum = document.querySelector("#todo-num"); 
let todoTrack = document.querySelector("#todo-track");
let message = document.querySelector(".message");
let completedTododelAll = document.querySelector(".completedTododelAll");

const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
const formattedDate = new Date().toLocaleDateString('en-GB', options).replace(/\//g, '-');
let sortField = document.querySelectorAll(".sortField");
let sortRefineContainer = document.querySelector(".sortRefineContainer");
let sortInput =document.querySelector("#sortInput");
let refineInput =document.querySelector("#refineInput");
let delAll =document.querySelector("#delAll");

// declaring edit,delete and markDone button functions
const delBtn = (id) => {
  return `<button class="todo-buttons delete-button" onclick=deleteTodo(${id})>
  Delete</button>`;
};

const editBtn = (id) => {
  return `<button class="todo-buttons edit-button" onclick=editTodo(${id})>
  Edit</button>`;
};

const markDoneBtn = (id) => {
  return `<button class="todo-buttons markDone-button" onclick=markDoneTodo(${id})>
  Mark as Done</button>`;
};

const delDoneBtn = (id) => {
  return `<button class="todo-buttons deleteDone-button" onclick=deleteDoneTodo(${id})>
  Delete</button>`;
};

const markUnDoneBtn = (id) => {
  return `<button class="todo-buttons markUnDone-button" onclick=markUnDoneTodo(${id})>
  Mark as UnDone</button>`;
};


// initialize todo array
let todos = [];
let CompletedTodos = [];
//items from todo array to localstorage
if (localStorage.getItem("todos")) {
  todos = JSON.parse(localStorage.getItem("todos"));
}

document.addEventListener("DOMContentLoaded", function () {
  // Set the scrollTop property of the ul to its maximum value
  todoList.scrollTop = todoList.scrollHeight;
  if (todos.length > 0) {
    document.querySelector(".message").classList.add("hidden");

  }
  else if(todos.length == 0)
  {
    sortField.forEach(function(sortField) {
      sortField.classList.add('hidden');
    });
    delAll.classList.add("hidden");
  }
});
todoNum = todos.length;
todoTrack.innerHTML = `${todoNum} todos added`;
completedTododelAll.classList.add('hidden');

// upon refresh
for(let i = 0; i < todos.length; i++)
{
  Createlis(i);
}

// function to create lis
function Createlis(i)
{
  /* each todo-item entry */
  todoNum = todos.length;
  todoTrack.innerHTML = `${todoNum} todos added`;
  let li = document.createElement("li");
  li.setAttribute("class", `todo-item`);
  li.setAttribute("id", `todo-${i+ 1}`);
  const displaydate = todos[i].due ? new Date(todos[i].due).toLocaleDateString('en-GB', options).replace(/\//g, '-') : null;

  /*each todo-item category tag, priority tag ,description, added and due dates**/
  li.innerHTML =`
  <div class="input-container" id="input-container">
  <div class=tags>
    <span class="category-tag">${todos[i].cat}</span>
    <span class="priority-tag">${todos[i].priority}</span>
    </div>
    <h2 class="todo-description">${todos[i].todo}</h2>
    <div class="todo-dates">Added: ${todos[i].added}${displaydate ? ` | Due: ${displaydate}` : ''}</div>
  </div>
  `
/*each todo-item edit delete and markDone buttons*/
  let div3 = document.createElement("div");
  div3.classList.add("btns");
  div3.innerHTML += editBtn(i+1);
  div3.innerHTML += delBtn(i+1);
  div3.innerHTML += markDoneBtn(i+1);
  li.append(div3);

  todoList.append(li);
 /*do not display category tag with null*/
 let categoryTag = document.querySelectorAll(".category-tag");
 if(categoryTag[i].textContent == "null")
 {
   categoryTag[i].classList.add("hidden");
 }

  /*each todo-item priority tag*/
 let priorityTag = document.querySelectorAll(".priority-tag");

  if(priorityTag[i].textContent == "high")
  {
    priorityTag[i].classList.add("priority-tag-high");
  }
  else if(priorityTag[i].textContent == "medium")
  {
    priorityTag[i].classList.add("priority-tag-medium");
  }
  else if(priorityTag[i].textContent == "low")
  {
    priorityTag[i].classList.add("priority-tag-low");
  }
  else if(priorityTag[i].textContent == "null")
  {
    priorityTag[i].classList.add("hidden");
  }
}
/*taking data from array and sent to li and localstorage*/
function addTodo(due, todo, cat, priority) 
{
  let todoObj = {
    due: due,
    todo: todo,
    cat: cat,
    priority: priority,
    added: new Date().toLocaleDateString('en-GB', options).replace(/\//g, '-'),
  }
  
  let item = todoObj.todo.trim();
  if (item == "") {
    return;
  }
  
  todoNum = todos.length;
  todoTrack.innerHTML = `${todoNum} todos added`;

  document.querySelector(".message").classList.add("hidden");
  sortField.forEach(function(sortField) {
    sortField.classList.remove('hidden');
  });
  delAll.classList.remove("hidden");
  
  todos.push(todoObj);
  
  localStorage.setItem("todos", JSON.stringify(todos));
  Createlis(todos.length-1);

  todoList.scrollTop = todoList.scrollHeight;
}
/*taking input from user and storing in an array*/

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let formData = new FormData(e.target);

  let due = formData.get("due-date") || null;
  let todo = formData.get("todo");
  let cat = formData.get("category") || null; 
  let priority = formData.get("priority") || null;

  
  addTodo(due, todo, cat, priority);
  form.reset();
});

// DELETE BUTTON FUNCTIONALITY

const deleteTodo = (index) => {
  index = index - 1;
  let deletedLi = document.querySelector(`#todo-${index + 1}`);
  deletedLi.remove();

  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));

  todoNum = todos.length;
  todoTrack.innerHTML = `${todoNum} todos added`;
  refreshIDs();

  if (todos.length == 0) {
    message.classList.remove("hidden");
    sortField.forEach(function(sortField) {
      sortField.classList.add('hidden');
    });
    delAll.classList.add("hidden");
  }
};

/*Refresh IDs of li and buttons*/
const refreshIDs = () => {
  let lis = document.querySelectorAll("li");

  for (let i = 0; i < lis.length; i++) {
    const deleteButton = lis[i].querySelector(".delete-button");
    const editButton = lis[i].querySelector(".edit-button");
    const markDoneButton = lis[i].querySelector(".markDone-button");

    lis[i].setAttribute("id", `todo-${i +1}`);

    deleteButton.setAttribute("onclick", `deleteTodo(${i + 1})`);
    editButton.setAttribute("onclick", `editTodo(${i + 1})`)
    markDoneButton.setAttribute("onclick",`markDoneTodo(${i+1})`);
  }
};

// EDIT BUTTON FUNCTIONALITY
const editTodo = (index) => {
  let editedTodo = document.querySelector(`#todo-${index} h2`);
  let edit = prompt("Edit todo", editedTodo.textContent);

  edit = edit.trim();

  if (edit == "") {
    return;
  }

  todos[index - 1].todo = edit;
  localStorage.setItem("todos", JSON.stringify(todos));
  
  editedTodo.textContent = edit;

};

// MARK AS READ BUTTON FUNCTIONALITY
const markDoneTodo = (index) => {

  index = index - 1;
  let markedTodo = todos[index];

  // Move the todo to completedTodos array
  CompletedTodos.push(markedTodo);
  localStorage.setItem("CompletedTodos", JSON.stringify(CompletedTodos));

  // Remove the todo from todos array
  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));

  // Remove the todo element from the DOM
  let deletedLi = document.querySelector(`#todo-${index + 1}`);
  deletedLi.remove();

  todoNum = todos.length;
  todoTrack.innerHTML = `${todoNum} todos added`;

  refreshIDs();

  if (todos.length == 0) {
    message.classList.remove("hidden");
    sortField.forEach(function(sortField) {
      sortField.classList.add('hidden');
    });
    delAll.classList.add("hidden");
  }
};

// DELETE ALL BUTTON FUNCTIONALITY
const delAllTodo = (index) => {
  let deletedLiList = document.querySelectorAll(".todo-item");

  // Iterate through the NodeList and remove each element
  deletedLiList.forEach((deletedLi) => {
    deletedLi.remove();
  });

  localStorage.removeItem('todos');
  todos = [];
  todoNum = todos.length;
      todoTrack.innerHTML = `${todoNum} todos completed`;
  
    if (todos.length == 0) {
    document.querySelector(".message").classList.remove("hidden");
    sortField.forEach(function(sortField) {
      sortField.classList.add('hidden');
    });
    delAll.classList.add("hidden");
    }
};

//SORTING FUNCTIONALITY

//return selected sort input
sortInput.addEventListener('change', function()
{
  let sortedOption = sortInput.options[sortInput.selectedIndex].value;
  sortInput.selectedIndex = 0;
  sorting(sortedOption);
});
//check selected input
const sorting = (sortedOption) =>
{ 
    todoList.innerHTML = '';
    todoList.scrollTop = 0;
//Alphabetical-order sort
    if(sortedOption == "Alphabetical-Order")
        {
        todos.sort((a,b) => (a.todo > b.todo) ? 1 :-1 );
        }
//Category sort
    else if(sortedOption == "Category")
        {
        todos.sort((a,b) => (a.todo > b.todo) ? 1 :-1 );
        todos.sort((a, b) => {
        // Handle null cats
        if (a.cat === null && b.cat === null) {
            return 0; // If both cats are null, consider them equal
        }
        if (a.cat === null) {
            return 1; // Null cats come last
        }
        if (b.cat === null) {
            return -1; // Null cats come last
        }
        // Compare cats first
        if (a.cat < b.cat) {
            return -1;
        }
        if (a.cat > b.cat) {
            return 1;
        }
        todos.sort((a,b) => (a.todo > b.todo) ? 1 :-1 );
        // If cats are the same, then compare due dates
        const dueA = new Date(a.due);
        const dueB = new Date(b.due);
        return dueA - dueB;
        });
      }
//Due-date sort
    else if(sortedOption == "Due-Date")
    {
        todos.sort((a, b) => {
        // Convert due strings to Date objects for comparison
        const dueA = a.due ? new Date(a.due) : null;
        const dueB = b.due ? new Date(b.due) : null;
        // Handle null values
        if (dueA === null && dueB === null) {
            return 0; // If both due dates are null, consider them equal
        }
        if (dueA === null) {
            return 1; // Null values come last
        }
        if (dueB === null) {
            return -1; // Null values come last
        }
    
        // Compare due dates
        return dueA - dueB;
        });
    }
//Newest-first sort
    else if(sortedOption == "Newest-First")
    {
        todos.sort((a, b) => {
        // Convert date strings to Date objects for comparison
        const dateA = new Date(a.added);
        const dateB = new Date(b.added);
    
        // Compare dates
        return dateB - dateA;
        });
    }
//Oldest-first sort
    else if(sortedOption == "Oldest-First")
    {
        todos.sort((a, b) => {
        // Convert date strings to Date objects for comparison
        const dateA = new Date(a.added);
        const dateB = new Date(b.added);
    
        // Compare dates
        return dateA - dateB;
        });
    }
//Priority Sort
    else if(sortedOption == "Priority")
    {
      console.log(3);
      todos.sort((a,b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1, null:0 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
      }
      for(let i = 0; i < todos.length; i++)
      {
      Createlis(i);
      }
}

//REFINE FUNCTIONALITY

//return selected refine input
refineInput.addEventListener('change', function()
{
  let refinedOption = refineInput.options[refineInput.selectedIndex].value;
  refine(refinedOption);
  refineInput.selectedIndex = 0;
  
});

const refine = (refinedOption) =>
{  
  todoList.innerHTML = ''; // Clear the current list
  if(refinedOption == "Pending")
  {
    let todos = [];
    for (var i = 0; i < sortField.length; i++) {
      sortField[i].classList.remove('hidden');
    }
    delAll.classList.remove("hidden");
    completedTododelAll.classList.add("hidden");
    if (localStorage.getItem("todos")) {
      todos = JSON.parse(localStorage.getItem("todos"));
    }
    if (todos.length > 0) {
      document.querySelector(".message").classList.add("hidden");
    }
    else if(todos.length == 0)
    {
      sortField.forEach(function(sortField) {
        sortField.classList.add('hidden');
      });
      delAll.classList.add("hidden");
    }
    todoNum = todos.length;
    todoTrack.innerHTML = `${todoNum} todos pending`;


    for(let i = 0; i < todos.length; i++)
    {
    Createlis(i);
    }
    }
  
    else if(refinedOption == "Completed")
    {
      if (localStorage.getItem("CompletedTodos")) {
        CompletedTodos = JSON.parse(localStorage.getItem("CompletedTodos"));
      }
      todoNum = CompletedTodos.length;
      todoTrack.innerHTML = `${todoNum} todos completed`;
      document.querySelector(".message").classList.add("hidden");
      delAll.classList.add("hidden");
      completedTododelAll.classList.remove("hidden");
      if(CompletedTodos.length == 0)
      {
        sortField.forEach(function(sortField) {
          sortField.classList.add('hidden');
        });
        document.querySelector(".message").classList.remove("hidden");
        delAll.classList.add("hidden");
        completedTododelAll.classList.add("hidden");
      }

      for (var i = 0; i < sortField.length; i++) {
        sortField[i].classList.add('hidden');
      }
      for(let i = 0; i < CompletedTodos.length; i++)
      {
        let li = document.createElement("li");
        li.setAttribute("class", `CompletedTodo-item`);
        li.setAttribute("id", `CompletedTodo-${i+ 1}`);
        const displaydate = CompletedTodos[i].due ? new Date(CompletedTodos[i].due).toLocaleDateString('en-GB', options).replace(/\//g, '-') : null;
      
        /*each todo-item category tag, priority tag ,description, added and due dates**/
        li.innerHTML =`
        <div class="input-container" id="input-container">
        <div class=tags>
          <span class="category-tag">${CompletedTodos[i].cat}</span>
          <span class="priority-tag">${CompletedTodos[i].priority}</span>
          </div>
          <h2 class="todo-description">${CompletedTodos[i].todo}</h2>
          <div class="todo-dates">Added: ${CompletedTodos[i].added}${displaydate ? ` | Due: ${displaydate}` : ''}</div>
        </div>
  `
              /*each completed todo-item delete and mark UnDone buttons*/
        let div3 = document.createElement("div");
        div3.classList.add("btns");
        div3.innerHTML += delDoneBtn(i+1);
        div3.innerHTML += markUnDoneBtn(i+1);
        li.append(div3);

        todoList.append(li);
        let categoryTag = document.querySelectorAll(".category-tag");
        if(categoryTag[i].textContent == "null")
        {
          categoryTag[i].classList.add("hidden");
        }
        let priorityTag = document.querySelectorAll(".priority-tag");

        if(priorityTag[i].textContent == "high")
        {
          priorityTag[i].classList.add("priority-tag-high");
        }
        else if(priorityTag[i].textContent == "medium")
        {
          priorityTag[i].classList.add("priority-tag-medium");
        }
        else if(priorityTag[i].textContent == "low")
        {
          priorityTag[i].classList.add("priority-tag-low");
        }
        else if(priorityTag[i].textContent == "null")
        {
          priorityTag[i].classList.add("hidden");
        }
        }

    }
    return;
}
// COMPLETED DELETE BUTTON FUNCTIONALITY

const deleteDoneTodo = (index) => {
  index = index - 1;
  let deletedLi = document.querySelector(`#CompletedTodo-${index + 1}`);
  deletedLi.remove();

  CompletedTodos.splice(index, 1);
  localStorage.setItem("CompletedTodos", JSON.stringify(CompletedTodos));

  todoNum = CompletedTodos.length;
  todoTrack.innerHTML = `${todoNum} todos completed`;
  refreshCompletedIDs();

  if (CompletedTodos.length == 0) {
    message.classList.remove("hidden");
    sortField.forEach(function(sortField) {
      sortField.classList.add('hidden');
    });
    delAll.classList.add("hidden");
    completedTododelAll.classList.add('hidden');
  }
};

/*Refresh IDs of li and buttons*/
const refreshCompletedIDs = () => {
  let lis = document.querySelectorAll("li");

  for (let i = 0; i < lis.length; i++) {
    const deleteDoneButton = lis[i].querySelector(".deleteDone-button");
    const markUnDoneButton = lis[i].querySelector(".markUnDone-button");

    lis[i].setAttribute("id", `CompletedTodo-${i +1}`);

    deleteDoneButton.setAttribute("onclick", `deleteDoneTodo(${i + 1})`);
    markUnDoneButton.setAttribute("onclick",`markUnDoneTodo(${i +  1})`);
  }
};

// MARK AS UnREAD BUTTON FUNCTIONALITY
const markUnDoneTodo = (index) => {

  index = index - 1;
  let UnmarkedTodo = CompletedTodos[index];

  // Move the todo to completedTodos array
  todos.push(UnmarkedTodo);
  localStorage.setItem("todos", JSON.stringify(todos));

  // Remove the todo from todos array
  CompletedTodos.splice(index, 1);
  localStorage.setItem("CompletedTodos", JSON.stringify(CompletedTodos));

  // Remove the todo element from the DOM
  let deletedLi = document.querySelector(`#CompletedTodo-${index + 1}`);
  deletedLi.remove();

  todoNum = CompletedTodos.length;
  todoTrack.innerHTML = `${todoNum} todos completed`;

  refreshCompletedIDs();

  if (CompletedTodos.length == 0) {
    message.classList.remove("hidden");
    sortField.forEach(function(sortField) {
      sortField.classList.add('hidden');
    });
    delAll.classList.add("hidden");
    completedTododelAll.classList.add('hidden');
  }
};

// COMPLETED DELETE ALL BUTTON FUNCTIONALITY
const delAllCompletedTodo = (index) => {
  let deletedLiList = document.querySelectorAll(".CompletedTodo-item");

  // Iterate through the NodeList and remove each element
  deletedLiList.forEach((deletedLi) => {
    deletedLi.remove();
  });

  localStorage.removeItem('CompletedTodos');
  CompletedTodos = [];
  todoNum = CompletedTodos.length;
      todoTrack.innerHTML = `${todoNum} todos completed`;
  
    if (CompletedTodos.length == 0) {
    document.querySelector(".message").classList.remove("hidden");
    sortField.forEach(function(sortField) {
      sortField.classList.add('hidden');
    });
    completedTododelAll.classList.add("hidden");
    }
};