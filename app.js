//Storage Controller
const StorageCtrl = (function(){
  return {
    storeItem: function(item) {
      let items;
      if(localStorage.getItem('items') === null) {
        console.log('here');
        items = [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        console.log(items);
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },



    getItemsFromStorage: function() {
      let items;
      if(localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem('items', JSON.stringify(items));
    },

    deleteFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(id === item.id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem('items', JSON.stringify(items));
    },

    clearItemsFromStorage: function() {
      localStorage.removeItem('items');
    }
  }
})();
//Item Controller

const ItemCtrl = (function(){
  //Item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //Data structure
  const data = {
    // items: [
    //   // {id: 0, name: 'Steak Dinner', calories: 1200},
    //   // {id: 1, name: 'Patatoes', calories: 300},
    //   // {id: 2, name: 'Salada', calories: 200}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories:0
  }

  return {
    getItems: function() {
      return data.items;
    },

    addItem: function(name, calories) {

      if(data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 0;
      }
      calories = parseInt(calories);

      newItem = new Item(id, name, calories);
      data.items.push(newItem);
      return newItem;
    },

    getTotalCalories: function() {
      let total = 0;
      data.items.forEach(item => {
        total += item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },

    getItemById: function(id) {
      let found = null;
      data.items.forEach(item => {
        if(item.id === id) {
          found = item;
        }
      });
      return found;
    },

    updateItem: function(name, calories) {
      calories = parseInt(calories);

      let found = null;
      data.items.forEach(function(item) {
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function(id) {
      ids = data.items.map(function(item) {
        return item.id;
      });

      const index = ids.indexOf(id);

      data.items.splice(index, 1);
    },

    clearAllItems: function() {
      data.items = [];
    },

    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },

    logData: function() {
      return data;
    }
  }
})();

// UI Controller
const UICtrl = (function(){

  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    listItems: '#item-list li'
  }
  return {
    populateItemsList: function(items) {
      let html = '';
      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-edit"></i>
          </a>
        </li>`;
      });

      // Isert into ul a list itmems
       document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getSelectors: function() {
      return UISelectors;
    },

    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      }
    },

    addListItem: function(item) {
      document.querySelector(UISelectors.itemList).style.display = 'block';
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.name}:
      </strong><em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-edit"></i>
      </a>`;

      document.querySelector(UISelectors.itemList)
      .insertAdjacentElement('beforeend', li);
    },

    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      listItems = Array.from(listItems);
      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute('id');
        if(itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}:
          </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-edit"></i>
          </a>`;
        }
      });
    },

    clearAllListItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(listItem => {
        listItem.remove();
      });
      StorageCtrl.clearItemsFromStorage();
    },

    deleteListItem: function(id) {
      const itemID = `item-${id}`;
      document.querySelector(`#${itemID}`).remove();
    },

    clearInput: function(item) {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput)
      .value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput)
      .value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories)
      .textContent = totalCalories;
    },

    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    }


  }
})();

// App Controller
const App = (function(ItemCtrl, UICtrl, StorageCtrl){

  // Load event lesteners

  const loadEventListeners = function() {
    const UISelectors = UICtrl.getSelectors();

    // add addEventListener
    document.addEventListener('keypress', function(e) {
      if(e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    })
    document.querySelector(UISelectors.addBtn)
    .addEventListener('click', itemAddSubmit);
    document.querySelector(UISelectors.itemList)
    .addEventListener('click', itemEditClick);
    document.querySelector(UISelectors.updateBtn)
    .addEventListener('click', itemUpdateSubmit);
    document.querySelector(UISelectors.deleteBtn)
    .addEventListener('click', itemDeleteSubmit);
    document.querySelector(UISelectors.backBtn)
    .addEventListener('click', backButton);
    document.querySelector(UISelectors.clearBtn)
    .addEventListener('click', ClearAllItemsClick);
  }

  //Add item itemAddSubmit
  const itemAddSubmit = function(e) {
    //Get form input UI Controller

    const input = UICtrl.getItemInput();

    if(input.name !== '' && input.calories !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
    }

    //add Item to UI
    try {
      UICtrl.addListItem(newItem);
    } catch (err) {
      console.log(err);
    }

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearInput();

    StorageCtrl.storeItem(newItem);
    e.preventDefault();
  }

  const itemEditClick = function(e) {
    if(e.target.classList.contains('edit-item')){
      const listId = e.target.parentNode.parentNode.id;

      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);

      const itemToEdit = ItemCtrl.getItemById(id);

      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.addItemToForm();
    }
    e.preventDefault();
  }

  const itemUpdateSubmit = function(e) {
    const input = UICtrl.getItemInput();

    if(input.name !== '' && input.calories !== '') {
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    UICtrl.updateListItem(updatedItem);


    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    UICtrl.clearEditState();

    StorageCtrl.updateItemStorage(updatedItem);
    e.preventDefault();
    }
  }

  const itemDeleteSubmit = function(e) {

    const currentItem = ItemCtrl.getCurrentItem();
    ItemCtrl.deleteItem(currentItem.id);
    UICtrl.deleteListItem(currentItem.id);

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    const items = ItemCtrl.getItems();
    StorageCtrl.deleteFromStorage(currentItem.id);
    UICtrl.clearEditState();
    if(items.length === 0) {
      UICtrl.hideList();
    }

    e.preventDefault();
  }

  const ClearAllItemsClick = function(e) {
    ItemCtrl.clearAllItems();

    UICtrl.clearAllListItems();

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.hideList();
  }

  const backButton = function(e) {
    UICtrl.clearEditState();
    e.preventDefault();
  }

  return {
    init: function() {
      console.log('INitializing App...');

      UICtrl.clearEditState();
      const items = ItemCtrl.getItems();
      if(items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate lists with getItems
        UICtrl.populateItemsList(items);
      }

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);


      // loadEventListeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();
