import React from "react";

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = (props) => {
  return (
  <div className=" w-full lg:w-fit h-fit bg-white flex-row p-10 rounded-3xl border-2 border-gray-200">
    {props.children}
  </div>
  );
};

export default Card;