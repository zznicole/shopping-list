import React from 'react';
import ContentEditable from 'react-contenteditable';
import ListItem from './ListItem';

export default function Lists({ lists, checkList, deleteList }) {
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
          ContentEditable="true"
        />
      ))}
    </div>
  );
}