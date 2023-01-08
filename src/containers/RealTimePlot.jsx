import React, { useEffect } from "react";
import PlotBuilder from "../models/PlotBuilder";
import "./Dashboard.css";

const RealTimePlot = () => {
  const reactorPlot = new PlotBuilder("reactor-plot");
  const conversionPlot = new PlotBuilder("conversion-plot");
  const predictiveMaintenancePlot = new PlotBuilder(
    "predictive-maintenance-plot"
  );

  useEffect(() => {
    const plot1 = predictiveMaintenancePlot
      .addPlotTitle("Predictive Maintenance")
      .addTrace("marker", "Temperature")
      .addAxisDimension("x", [0, 1], "Time (s)", 0);

    const plot2 = conversionPlot
      .addPlotTitle("Methanol Composition")
      .addTrace("markers", "CO")
      .addTrace("markers", "CO2")
      .addTrace("markers", "H2O")
      .addTrace("markers", "H2")
      .addTrace("markers", "CH3OH")
      .addAxisDimension("y", ["CO"],"CO", 0)
      .addAxisDimension("y", ["CO2"], "mol (%)", 1)
      .addAxisDimension("y", ["H2O"], "mol (%)", 2)
      .addAxisDimension("y", ["H2"], "mol (%)", 3)
      .addAxisDimension("y", ["CH3OH"], "mol (%)", 4)
      .addAxisDimension("x", [0.2], "CO", 0)
      .addAxisDimension("x", [0.4], "mol (%)", 1)
      .addAxisDimension("x", [0.1], "mol (%)", 2)
      .addAxisDimension("x", [0.1], "mol (%)", 3)
      .addAxisDimension("x", [0.2], "mol (%)", 4)
      .addPieChart(0)
      .addPieChart(1)
      .addPieChart(2)
      .addPieChart(3)
      .addPieChart(4);
    console.log(plot2.plotData);

    const plot3 = reactorPlot.addPlotTitle(
      "Methanol Synthesis Reactor (MSR) Data"
    );

    [plot1, plot2, plot3].forEach((plot) => {
      plot.config.displayModeBar = false;
      plot.constructInitialPlot();
    });
  }, []);

  return (
    <div className="dashboard__contaier">
      <div className="dashboard__first-row pt-24">
        <div
          id="reactor-plot"
          className="shadow-md rounded-3xl min-w-[900px] max-h-[550px] m-2"
        ></div>
        <div className="bg-gray-200 h-[500px] w-[550px] shadow-md rounded-2xl m-2"></div>
      </div>
      <div className="dashboard__second-row">
        <div
          id="conversion-plot"
          className="shadow-md rounded-3xl min-w-[550px] max-h-[500px] m-2"
        ></div>
        <div
          id="predictive-maintenance-plot"
          className="shadow-md rounded-3xl min-w-[900px] max-h-[500px] m-2"
        ></div>
      </div>
    </div>
  );
};

export default RealTimePlot;
