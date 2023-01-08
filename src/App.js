import React from "react";
import Sidebar from "./components/sidebar/Sidebar";
import RealTimePlot from "./containers/RealTimePlot";
import "./App.css";

const App = () => {
  return (
    <div className="app__container">
      <Sidebar />
      <div className="app__dashboard">
        <div className="app__dashboard__navbar">
          <h2>Dashboard Title</h2>
        </div>
        <div class="app__dashboard__content">
          <RealTimePlot />
        </div>
      </div>
    </div>
  );
};
export default App;
