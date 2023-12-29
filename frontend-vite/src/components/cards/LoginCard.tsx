import React from "react";

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = (props) => {
  return (
  <div className=" w-full lg:w-fit h-fit bg-k-link-blue flex-row p-10 rounded-3xl border-2 border-gray-400 text-white">
    {props.children}
  </div>
  );
};

export default Card;