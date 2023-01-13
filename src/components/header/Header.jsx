import React from "react";

const Header = (props) => (
  <div className=" mb-10">
    <p className="text-lg text-gray-400">{props.category}</p>
    <p className="text-3xl font-extrabold tracking-tight text-slate-900">
      {props.title}
    </p>
  </div>
);

export default Header;
