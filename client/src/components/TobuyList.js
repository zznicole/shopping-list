import React from 'react';
import TobuyItem from './TobuyItem';

export default function TobuyList({ tobuys, checkTobuy, deleteTobuy }) {
  return (
    <div>
      {tobuys.map((tobuy) => (
        <TobuyItem
          key={tobuy.id}
          title={tobuy.title}
          checkTobuy={checkTobuy}
          id={tobuy.id}
          isCompleted={tobuy.isCompleted}
          deleteTobuy={deleteTobuy}
        />
      ))}
    </div>
  );
}
