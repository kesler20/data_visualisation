import React, { useEffect, useState } from "react";
import Channel from "./real_time_plot_components/Channel";
import PlotBuilder from "../../models/PlotBuilder";
import {
  constructChannelPlot,
  updateChannelPlot,
  range,
} from "../../models/DataProcessing";
import CustomizedSlider from "../../components/slider/Slider";
import { useStateContext, db } from "../../contexts/ContextProvider";
import BasicTabs from "../../components/tabs/Tabs";
import IosSwitch from "../../components/switches/IosSwitch";

export const trend = 1000;
let flag = true;

const plotly = new PlotBuilder("plot");
const indicator = new PlotBuilder("indicators");
const dataPointsToDisplay = 100;
const RealTimePlot = () => {
  const { clients, setClients, screenSize, currentMode } = useStateContext();
  const [dataset, setDataset] = useState([]);
  const [time, setTime] = useState(
    db.readResourceFromLocalStorage("/tff/data/json-database").length === 0
      ? new Date().getDate()
      : db.readResourceFromLocalStorage("/tff/data/json-database")[
          db.readResourceFromLocalStorage("/tff/data/json-database").length - 1
        ].x_value
  );

  // initialize dataset
  useEffect(() => {
    setDataset(
      db.readResourceFromLocalStorage(`/${clients[0].readTopic}/json-database`)
    );
  }, []);

  // update the dataset
  useEffect(() => {
    if (dataset !== [] || currentMode !== "Light") {
      plotDataset();
    }
  }, [dataset, currentMode, screenSize]);

  const plotDataset = () => {
    // get the values from the first channels from local storage
    const { controlled, errorBound, channelID, online, smoothing } = clients[0];
    // style the initial plot
    plotly.config.displayModeBar = false;
    plotly.addPlotTitle("Real Time Value");
    if (currentMode === "Dark") {
      plotly.addDarkMode();
    } else {
      plotly.addBackgroundColor("#f0f8fc");
    }

    plotly.addYAxisRange([trend - 50, trend + 50]);
    plotly.addAxis("y", "Value");
    plotly.addAxis("x", "Time");

    // construct the plot data from the values provided
    let plotData = constructChannelPlot(
      range(dataset, dataPointsToDisplay),
      errorBound,
      channelID,
      controlled,
      online
    );
    if (smoothing.visible) {
      plotData.push(handleInitialSMA(clients[0]));
    }

    if (dataset.length !== 0) {
      const { trend_1, total_1 } = dataset[dataset.length - 1];
      indicator.addIndicators(total_1, trend_1);
      indicator.config.displayModeBar = false;
      indicator.addBackgroundColor("#fafafa");
      indicator.constructInitialPlot();
    }

    // plot the dataset
    plotly.constructInitialPlot(plotData);
  };

  const handleDatabaseUpdate = () => {
    const { errorBound, channelID } =
      db.readResourceFromLocalStorage("clients")[0];
    const data = db.readResourceFromLocalStorage(
      `/${clients[0].readTopic}/json-database`
    );

    const xaxisRange = [
      new Date(data[data.length - dataPointsToDisplay + 1].x_value),
      new Date(data[data.length - 1].x_value),
    ];

    let datasetUpdate = updateChannelPlot(data, errorBound, channelID);
    datasetUpdate = updateSMA(datasetUpdate);
    plotly.updateInitialPlot(datasetUpdate.y, datasetUpdate.x, xaxisRange);

    const { trend_1, total_1 } = data[data.length - 1];
    indicator.addIndicators(total_1, trend_1);
    indicator.config.displayModeBar = false;
    indicator.addBackgroundColor("#fafafa");
    indicator.constructInitialPlot();

    setTime(new Date(data[data.length - 1].x_value));

    if (
      data[data.length - 1].total_1 <= trend - errorBound ||
      data[data.length - 1].total_1 >= trend + errorBound
    ) {
      if (flag) {
        setDataset(db.readResourceFromLocalStorage("/tff/data/json-database"));
        flag = false;
      }
    } else {
      if (!flag) {
        setDataset(db.readResourceFromLocalStorage("/tff/data/json-database"));
        flag = true;
      }
    }
  };

  const updateClient = (key, value, id) => {
    setClients(
      clients.map((client) => {
        const { channelID } = client;
        if (channelID === id) {
          client[`${key}`] = value;
          return client;
        } else {
          return client;
        }
      })
    );

    setDataset(
      db.readResourceFromLocalStorage(`/${clients[0].readTopic}/json-database`)
    );
  };

  const updateSMA = (extendedTrace) => {
    clients.forEach((channel) => {
      if (channel.smoothing.visible) {
        extendedTrace.y.push([
          db.readResourceFromLocalStorage(
            `/${channel.readTopic}/sma/json-database`
          )[
            db.readResourceFromLocalStorage(
              `/${channel.readTopic}/sma/json-database`
            ).length - 1
          ].y,
        ]);
        extendedTrace.x.push([
          db.readResourceFromLocalStorage(
            `/${channel.readTopic}/sma/json-database`
          )[
            db.readResourceFromLocalStorage(
              `/${channel.readTopic}/sma/json-database`
            ).length - 1
          ].x,
        ]);
      }
    });
    return extendedTrace;
  };

  const handleInitialSMA = (channel) => {
    let opacity = 0.7;
    let marker = {
      size: 10,
      opacity: 0.5,
      line: { width: 2, dash: "dot" },
    };
    let result = {
      y: [],
      x: [],
      name: `smoothed ${channel.clientID}`,
      mode: "lines+markers",
      marker,
      opacity,
    };
    const emptyArr = Array.from({ length: 22 }, () => {
      return NaN;
    });
    emptyArr.forEach((val) => {
      result.y.push(val);
      result.x.push(val);
    });

    let smoothedData = range(
      db.readResourceFromLocalStorage(
        `/${channel.readTopic}/sma/json-database`
      ),
      10
    );

    smoothedData.forEach((data) => {
      result.y.push(data.y);
      result.x.push(data.x);
    });
    return result;
  };

  const handleSmoothingClicked = (id) => {
    // add the smoothing data point
    const { smoothing } = clients[id];
    updateClient("smoothing", { value: 0, visible: !smoothing.visible }, id);
  };

  const handleChangeControl = (id) => {
    // remove the boundaries of the control
    const { controlled } = clients[id];
    updateClient("controlled", !controlled, id);
  };

  const handleChangeErrorBound = (e, id) => {
    // change the value of the errorBound and force the rerender of the plot
    updateClient("errorBound", parseInt(e.target.innerText), id);
  };

  const handleChangeControlIntensity = (value, id) => {
    // change the control intensity of the check algorithm
    updateClient("controlIntensity", value, id);
  };

  const handlePowerBtnClicked = (id) => {
    const { online, controlled } = clients[id];
    updateClient("controlled", !controlled, id);
    updateClient("online", !online, id);
  };

  return (
    <div className="mt-6 ml-10 mr-12 h-[140vh] md:h-screen">
      <div className="flex flex-col md:flex-row justify-between w-full bg-[#f0f8fc] dark:bg-[#20232a] md:h-[60vh]">
        <div id="plot" className="hidden md:block w-[70%] rounded-3xl"></div>
        <div className="bg-white dark:bg-[#1b2444] h-full w-full md:w-[25%] flex items-center justify-center flex-col shadow-lg p-8">
          <p className="text-[#76889c] m-5 md:m-2">TFF-1 Current Value</p>
          <div
            id="indicators"
            className="flex flex-col items-center justify-center w-full h-full shadow-lg bg-[#fafafa] overflow-hidden"
          >
            <div className="flex-col items-center hidden md:flex justify-center">
              <h1 className="text-2xl">Time</h1>
              <h1 className="text-[2rem] font-semibold">
                {new Date(time).getHours()} : {new Date(time).getMinutes()} :{" "}
                {new Date(time).getSeconds()}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex mt-4 lg:justify-around justify-center items-center w-full">
        {screenSize <= 400 ? (
          <div class="bg-white dark:bg-[#24315a] card shadow-lg rounded-3xl p-8 mt-10">
            <BasicTabs
              tabPanels={clients.map((channel, index) => {
                console.log(channel.errorBound, channel.controlIntensity);
                return (
                  <div
                    className="flex flex-col justify-center items-center pt-10"
                    key={index}
                  >
                    <CustomizedSlider
                      name={"Control Intensity"}
                      minValue={1}
                      maxValue={5}
                      handleChangeValue={(e) =>
                        handleChangeControlIntensity(e, index)
                      }
                      defaultValue={channel.controlIntensity}
                    />
                    <CustomizedSlider
                      name={"Error Bound"}
                      minValue={0}
                      maxValue={30}
                      handleChangeValue={(e) =>
                        handleChangeErrorBound(e, index)
                      }
                      defaultValue={channel.errorBound}
                    />
                    <div className="w-full flex justify-between items-center">
                      <p
                        style={{
                          color: `${
                            currentMode === "Light" ? "black" : "white"
                          }`,
                        }}
                      >
                        Smoothing
                      </p>
                      <IosSwitch
                        checked={channel.controlled}
                        customFunc={() => handleSmoothingClicked(index)}
                      />
                    </div>

                    <div className="w-full flex justify-between items-center">
                      <p
                        style={{
                          color: `${
                            currentMode === "Light" ? "black" : "white"
                          }`,
                        }}
                      >
                        Control Process
                      </p>
                      <IosSwitch
                        checked={channel.smoothing.visible}
                        customFunc={() => handleChangeControl(index)}
                      />
                    </div>
                  </div>
                );
              })}
              tabPanelLabels={clients.map((channel) => {
                return channel.clientID;
              })}
            />
          </div>
        ) : (
          <div
            div
            className="flex lg:justify-around justify-evenly items-center w-full"
          >
            {clients.map((client, index) => {
              return (
                <Channel
                  key={index}
                  client={client}
                  onSmoothingClicked={(id) => handleSmoothingClicked(id)}
                  onChangeControlled={(id) => handleChangeControl(id)}
                  onUpdateDatabase={() => handleDatabaseUpdate()}
                  onChangeErrorBound={handleChangeErrorBound}
                  onChangeControlIntensity={(v, id) =>
                    handleChangeControlIntensity(v, id)
                  }
                  onPowerBtnClicked={handlePowerBtnClicked}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default RealTimePlot;

// TODO: another solution would be to implement another useEffect only to update the chart,
// the chart would get the clients from localStorage and an update will be triggered on either useEffects using the
// datasetUpdate state, which can be kept to {} as default and if datasetUpdate.y === undefined you should update the
// static plot because in that case it could be that no data is running

// TODO: make the dashboard rerender at certyain periods to ensure that nothing weird is being plotted
