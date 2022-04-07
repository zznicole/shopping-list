import React, { useState } from "react";

const Editable =( {
  text, 
  type,
  placeholder,
  callback,
  children,
  ...props
}) => {
  const [isEditing, setEditing] =  useState(false);
  const handleKeyDown = (event, type) => {
  
  };
  return (
    <section {...props}>
      {isEditing ? (
        <div onBlur={()=> {setEditing(false);callback(false)}}
        onKeyDown={e => handleKeyDown(e, type)}>
          {children}
        </div>
      ) : (
        <div onClick={()=> {setEditing(true);callback(true)}}>
          <span>
            {text || placeholder || "Editable content"}
          </span>
        </div>
      )}
    </section>

  );
};

export default Editable;