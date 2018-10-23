//Storage Controller

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
    items: [
      // {id: 0, name: 'Steak Dinner', calories: 1200},
      // {id: 1, name: 'Patatoes', calories: 300},
      // {id: 2, name: 'Salada', calories: 200}
    ],
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
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
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
const App = (function(ItemCtrl, UICtrl){

  // Load event lesteners

  const loadEventListeners = function() {
    const UISelectors = UICtrl.getSelectors();

    // add addEventListener
    document.querySelector(UISelectors.addBtn)
    .addEventListener('click', itemAddSubmit);
    document.querySelector(UISelectors.itemList)
    .addEventListener('click', itemUpdateSubmit);
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
    e.preventDefault();
  }

  const itemUpdateSubmit = function(e) {
    if(e.target.classList.contains('edit-item')){
      const listId = e.target.parentNode.parentNode.id;

      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);

      const itemToEdit = ItemCtrl.getItemById(id);
      console.log(itemToEdit);

      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.addItemToForm();
    }
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
})(ItemCtrl, UICtrl);

App.init();
