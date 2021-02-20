const dboo = require('dboo');
const parser = require('./parser.js');
const userid = require('./userid.js');

class ItemType
{
  constructor() {
  }
}
exports.ItemType = ItemType;

dboo.class(ItemType,
  []
);

class Category
{
  summary = "";
  description = "";
  constructor(summary = "") {
    this.summary = summary;
  }
}
exports.Category = Category;

dboo.class(Category,
  [{"summary": dboo.string},
   {"description": dboo.string}]
);

function createCategory(summary, description = "")
{
  let i = new Category();
  i.summary = summary;
  i.description = description;
  return i;
}

class Item
{
  summary = "";
  description = "";
  done = false;
  category = null;
  itemType = null;
  constructor() {}
};
exports.Item = Item;

dboo.class(Item,
  [{"summary": dboo.string},
   {"description": dboo.string},
   {"category": Category},
   {"done": dboo.bool},
    {"itemType": ItemType}
   ]
);

function createItems(summary, description, category, fn)
{
  let items = [];
  let lines = parser.parse(summary,
    function (lines) {
      for (let line of lines) {
        let i = new Item();
        i.summary = line;
        i.description = "";
        i.category = category;
        i.itemType = null;
        items.push(i);
      }
      fn(items);
    });
  return items;
}

function createItem(summary, description, category)
{
  let i = new Item();
  i.summary = summary;
  i.description = description;
  i.category = category;
  return i;
}

class ShoppingList
{
  summary = "";
  description = "";
  items = [];
  done = false;
  owner = null;
  users = [];
  
  constructor() {}
};
exports.ShoppingList = ShoppingList;

dboo.class(ShoppingList,
  [{"summary": dboo.string},
   {"description": dboo.string},
   {"items": dboo.array(Item)},
    {"done": dboo.bool},
    {"owner": userid.UserId},
    {"users": dboo.array(userid.UserId)},
    ]
);

function createList(summary, description, owner)
{
  let s = new ShoppingList();
  s.summary = summary;
  s.description = description;
  s.owner = owner.userId;
  return s;
}

exports.createList = createList;
exports.createItem = createItem;
exports.createItems = createItems;
exports.createCategory = createCategory;