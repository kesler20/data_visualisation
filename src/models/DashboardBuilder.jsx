export default class DashboardBuilder {
  /**
   * the plots (second argument) has the following structure:
   * ```javascript
   * [
   *  {
   *    plot : {}, // plotly object
   *    dataGrid : { x: 0, y: 0, w: 5, h: 10 },
   *    tools : {}, // interactive tools
   *    plotly : new PlotlyBuilder("plotly-n") // where n refers to the length of the plots array
   *  },
   *   ...
   * ]
   * ```
   * @param {*} title - this refers ot the title of the plot
   * @param {*} plots - this is an array of objects
   * @param {*} bgColor - this is the background color of the dashboard
   * @param {*} darkBgColor - this is the dashboard background in darkMode
   */
  constructor(title, plots, bgColor, darkBgColor) {
    this.title = title;
    this.plots = plots;
    this.bgColor = bgColor;
    this.darkBgColor = darkBgColor;
  }

  addPlots(plots) {
    this.plot = plots;
    return this;
  }

  addPlot() {
    this.plots.push({
      plotSchema: {
        axis: [],
        plotType: "Scatter Plot",
        theme: "light",
        filename: "",
      },
      dataGrid: { x: 4, y: 0, w: 4, h: 4 },
      tools: {},
    });
    return this;
  }

  /**
   * add the title to the dashboard ``this.title = title``
   * @param {*} title - string which will be used as the title of the dashboard
   * @returns this
   */
  addTitle(title) {
    this.title = title;
    return this;
  }

  addTool() {
    this.plots.push({
      plotSchema: {
        axis: [],
        plotType: "Scatter Plot",
        theme: "light",
        filename: "",
      },
      dataGrid: { x: 4, y: 0, w: 4, h: 4 },
      tools: { name: "tool" },
    });
    return this;
  }

  removeTool() {
    // we only want to have one tool in the dashboard
    this.plots = this.plots.filter(
      (plotMetadata) => plotMetadata.tools.name === undefined
    );
    return this;
  }

  importDashboardData(dashboardData) {
    Object.keys(dashboardData).forEach((k) => {
      this[k] = dashboardData[k];
    });
    return this;
  }

  removePlot(plotID) {
    this.plots = this.plots.filter(
      (plot) => this.plots.indexOf(plot) !== plotID
    );
    return this;
  }

  addDashboardTitle(title) {
    this.title = title;
    return this;
  }

  addBgColor(bgColor) {
    this.bgColor = bgColor;
    return this;
  }

  addDarkBgColor(darkBgColor) {
    this.darkBgColor = darkBgColor;
    return this;
  }

  buildDashboard() {
    return this;
  }

  /**
   * this returns the plot object within the array:
   * ```javascript
   *{
   *  plot: {},
   *  dataGrid: { x: 0, y: 0, w: 5, h: 10 },
   *  tools: {},
   *  plotly: new PlotlyBuilder(`plotly-${this.plots.length}`)
   * }
   * ```
   * @param {*} id - the index of the plot within the plots array
   *
   * @returns this
   */
  addPlotSchema(plotSchema, id) {
    this.plots[id].plotSchema = plotSchema;
    return this;
  }
}
