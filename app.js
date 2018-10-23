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

    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories)
      .textContent = totalCalories;
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
  }

  //Add item itemAddSubmit
  const itemAddSubmit = function(e) {
    //Get form input UI Controller

    const input = UICtrl.getItemInput();

    if(input.name !== '' && input.calories !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      console.log(ItemCtrl.logData());
    }

    //add Item to UI
    UICtrl.addListItem(newItem);

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearInput();
    e.preventDefault();
  }

  return {
    init: function() {
      console.log('INitializing App...');
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
