import React from 'react';
import ListItem from './ListItem';

function screenName(user) {
  return user.screenName && user.screenName.length > 0 ? user.screenName : user.userId;
}
function usersAsString(users) {
  let usersStr = "";
  if (users) {
    for (let u of users) {
      if (usersStr.length > 0) {
        usersStr = usersStr + ", ";
      }
      usersStr = usersStr + screenName(u);
    }
  }
  
  return usersStr;
}

export default function Lists({ lists, checkList, deleteList , goToList}) {
  return (
    <div>
      {lists.map((list) => (
        <ListItem
        key={list.id}
        title={list.title}
        subtitle={list.subtitle}
        checkList={checkList}
        id={list.id}
        isCompleted={list.isCompleted}
        deleteList={deleteList}
        goToList={goToList}
        sharing={list.isOwn && list.isShared ? "Shared with " + usersAsString(list.sharedWith) + "." :
          (!list.isOwn ? "Shared by " + screenName(list.owner) + "." : "")}
        />
        ))}
    </div>
  );
}