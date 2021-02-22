import React from 'react';
import TobuyItem from './TobuyItem';

export default function TobuyList({ tobuys, checkTobuy, deleteTobuy, editTobuy, keyPrefix}) {
  return (
    <div>
      {tobuys.map((tobuy) => (
          <TobuyItem
          key={keyPrefix+tobuy.itemid}
          title={tobuy.title}
          subtitle={tobuy.subtitle}
          itemType={tobuy.itemType}
          checkTobuy={checkTobuy}
          id={tobuy.itemid}
          isCompleted={tobuy.isCompleted}
          deleteTobuy={deleteTobuy}
          editTobuy={editTobuy}
          />
      ))}
    </div>
  );
}
