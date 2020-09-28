const dboo = require('dboo.node');

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

class ShoppingList
{
  summary = "";
  description = "";
  items = [];
  done = false;
  
  constructor() {}
  create(summary, description) {
    let s = new ShoppingList();
    s.summary = summary;
    s.description = description;
  }
};
exports.ShoppingList = ShoppingList;

dboo.class(ShoppingList,
  [{"summary": dboo.string},
   {"description": dboo.string},
   {"items": dboo.sequence(Item)},
   {"done": dboo.bool}]
);

function createList(summary, description)
{
  return ShoppingList.create(summary, description);
}