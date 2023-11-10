import React from "react";

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = (props) => {
  return (
  <div className="w-fit bg-white flex items-center justify-center p-10 rounded-3xl border-8 border-gray-200 shadow-md">
    {props.children}
  </div>
  );
};

export default Card;