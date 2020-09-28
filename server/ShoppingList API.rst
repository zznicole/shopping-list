=================
Shopping list API
=================

Commands:

* Add user
* Login
* Get shopping lists
* Create shopping list
* Delete shopping list
* Edit shopping list (name)
* Share shopping list
* Get shopping list items
* Add item
* Delete item
* Check item
* Edit item


Add user
========

Request:

.. code-block:: html

  http://host:port/cmd=addUser&userid=userid&pwd=pwd
  
  cmd: addUser
  userid: String with new user id
  pwd: String with user's password

Returns:

.. code-block:: json

  {
    success: Bool True|False,
    message: String
  }

Login
=====

Request:

.. code-block:: html

  http://host:port/cmd=login&userid=userid&pwd=pwd
  
  cmd: addUser
  userid: String with user id
  pwd: String with user's password

Returns session id which is required for all user operations:

.. code-block:: json

  {
    success: Bool True|False,
    message: String,
    session: String
  }


Get user's shopping lists
=========================

Request:

.. code-block:: html

  http://host:port/session=sessionid&cmd=getLists
  
  sessionid: String from login return message,
  cmd: getLists

Returns all shopping lists names and ids:

.. code-block:: json

  {
    success: Bool True|False,
    message: String,
    session: String,
    lists: [{id: 6546, name: "My list"}, {id: 6547, name: "My list 2"} ]
  }

Create shopping list
====================

Request:

.. code-block:: html

  http://host:port/session=sessionid&cmd=createList&name=name
  
  sessionid: String from login return message,
  cmd: createList
  name: String with shopping list name

Returns list id:

.. code-block:: json

  {
    success: Bool True|False,
    message: String,
    session: String,
    listid: String
  }

Delete shopping list
====================

Request:

.. code-block:: html

  http://host:port/session=sessionid&cmd=deleteList&listId=listid

  sessionid: String from login return message,
  cmd: deleteList,
  listId: Id of list to delete
  
Returns:

.. code-block:: json

  {
    success: Bool True|False,
    message: String,
    session: String,
  }
  
Edit shopping list
====================

Request:

.. code-block:: html

  http://host:port/session=sessionid&cmd=editList&listId=listid&name=name

  sessionid: String from login return message,
  cmd: editList,
  listId: Id of list to edit
  name: New name for shopping list
  
Returns:

.. code-block:: json

  {
    success: Bool True|False,
    message: String,
    session: String,
  }

Share list
==========

Request:

.. code-block:: html

  http://host:port/session=sessionid&cmd=shareList&listId=listid&otherUserId=userid

  sessionid: String from login return message,
  cmd: editList,
  listId: Id of list to share
  name: User id for the other user to share with

Returns:

.. code-block:: json

  {
    success: Bool True|False,
    message: String,
    session: String
  }
  
    
Add item
========

Request:

.. code-block:: html

  http://host:port/session=sessionid&cmd=addItem&listId=listid&desc=desc

  sessionid: String from login return message,
  cmd: addItem,
  listId: Id of list to add item to,
  desc: String with item description
  
Returns list id and new item id:

.. code-block:: json

  {
    success: Bool True|False,
    message: String,
    session: String,
    listid: String,
    itemid: String
  }

    
Delete item
===========

Request:

.. code-block:: html

  http://host:port/session=sessionid&cmd=deleteItem&listId=listid&itemId=itemid

  sessionid: String from login return message,
  cmd: deleteItem,
  listId: Id of list to remove item from,
  itemId: Id of item to remove
  
Returns:

.. code-block:: json

  {
    success: Bool True|False,
    message: String,
    session: String
  }

    
Check item
===========

Request:

.. code-block:: html

  http://host:port/session=sessionid&cmd=checkItem&itemId=itemid

  sessionid: String from login return message,
  cmd: checkItem,
  itemId: Id of item to mark as done
  
Returns:

.. code-block:: json

  {
    success: Bool True|False,
    message: String,
    session: String
  }
    
Edit item
===========

Request:

.. code-block:: html

  http://host:port/session=sessionid&cmd=editItem&itemId=itemid&desc=newdesc

  sessionid: String from login return message,
  cmd: editItem,
  itemId: Id of item to mark as done
  desc: New description for item
  
Returns:

.. code-block:: json

  {
    success: Bool True|False,
    message: String,
    session: String
  }

