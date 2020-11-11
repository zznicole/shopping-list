import React from 'react';
import ListItem from './ListItem';

export default function Lists({ lists, checkList, deleteList , goToList}) {
  return (
    <div>
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
          sharing={list.isOwn && list.isShared ? "Shared with " + list.shareCount.toString() + " other" + (list.shareCount == 1?"":"s") + "." :
            (!list.isOwn ? "Shared by " + list.owner + "." : "")}
          />
          ))}
      </div>
      <div>"need space"</div>
    </div>
  );
}