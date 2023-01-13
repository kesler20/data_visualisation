import React from "react";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  DateTime,
  SplineAreaSeries,
  Legend,
} from "@syncfusion/ej2-react-charts";
import { useStateContext } from "../../contexts/ContextProvider";
import {
  areaChartData,
  areaPrimaryXAxis,
  areaPrimaryYAxis,
  areaCustomSeries,
} from "../../default_data/chartData";

const Area = () => {
  const { currentMode } = useStateContext();

  return (
    <div className="w-full">
      <ChartComponent
        id="charts"
        primaryXAxis={areaPrimaryXAxis}
        primaryYAxis={areaPrimaryYAxis}
        chartArea={{ border: { width: 0 } }}
        background={currentMode === "Dark" ? "#33373E" : "#fff"}
        legendSettings={{ background: "white" }}
      >
        <Inject services={[SplineAreaSeries, DateTime, Legend]} />
        <SeriesCollectionDirective>
          {areaCustomSeries.map((item, index) => (
            <SeriesDirective key={index} {...item} />
          ))}
        </SeriesCollectionDirective>
      </ChartComponent>
    </div>
  );
};

export default Area;
