const dboo = require('dboo');

class Category
{
  summary = "";
  description = "";
  constructor() {}
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
  category;
  constructor() {}
};
exports.Item = Item;

dboo.class(Item,
  [{"summary": dboo.string},
   {"description": dboo.string},
   {"category": Category},
   {"done": dboo.bool}]
);

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
  
  constructor() {}
};
exports.ShoppingList = ShoppingList;

dboo.class(ShoppingList,
  [{"summary": dboo.string},
   {"description": dboo.string},
   {"items": dboo.array(Item)},
   {"done": dboo.bool}]
);

function createList(summary, description)
{
  let s = new ShoppingList();
  s.summary = summary;
  s.description = description;
  return s;
}

exports.createList = createList;
exports.createItem = createItem;
exports.createCategory = createCategory;