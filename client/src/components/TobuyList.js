import React from 'react';
import TobuyItem from './TobuyItem';

export default function TobuyList({ tobuys, checkTobuy, deleteTobuy, editTobuy }) {
  return (
    <div>
      {tobuys.map((tobuy) => (
        <TobuyItem
          key={tobuy.itemid}
          title={tobuy.title}
          subtitle={tobuy.subtitle}
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
