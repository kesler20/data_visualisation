function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export const arrayOfChars = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
];

export const convertUnixEpochTimeSToDate = (unixEpochTimeS) => {
  const unixEpochTimeMS = unixEpochTimeS * 1000;
  const d = new Date(unixEpochTimeMS);
  let h = addZero(d.getHours());
  let m = addZero(d.getMinutes());
  let s = addZero(d.getSeconds());
  let time = h + ":" + m + ":" + s;
  return time;
};

export const convertEpochTimeToLocalTime = (unixEpochTimeS) => {
  return new Date(unixEpochTimeS * 1000);
};
export const getRandomNumber = (maxNum) => {
  return Math.floor(Math.random() * maxNum);
};

/**
 * This generates a random rgb color
 * @ param {*} intensity - highest intensity is a range from 255 to 0 inclusive
 * @returns "rgb(r, g, b)
 */
export const getRandomColor = (intensity) => {
  const r = getRandomNumber(intensity);
  const g = getRandomNumber(intensity);
  const b = getRandomNumber(intensity);

  return `rgb(${r}, ${g}, ${b})`;
};

export const range = (collection, numberOfDataPoints) => {
  const reducedCollection = [];
  for (let i = 1; i < collection.length; i++) {
    if (i < numberOfDataPoints) {
      try {
        reducedCollection.push(collection.pop());
      } catch (e) {
        console.log(e);
      }
    }
  }

  reducedCollection.reverse();
  return reducedCollection;
};

function createData(name, calories, fat) {
  return { name, calories, fat };
}

export const rows = [
  createData("Cupcake", 305, 3.7),
  createData("Donut", 452, 25.0),
  createData("Eclair", 262, 16.0),
  createData("Frozen yoghurt", 159, 6.0),
  createData("Gingerbread", 356, 16.0),
  createData("Honeycomb", 408, 3.2),
  createData("Ice cream sandwich", 237, 9.0),
  createData("Jelly Bean", 375, 0.0),
  createData("KitKat", 518, 26.0),
  createData("Lollipop", 392, 0.2),
  createData("Marshmallow", 318, 0),
  createData("Nougat", 360, 19.0),
  createData("Oreo", 437, 18.0),
].sort((a, b) => (a.calories < b.calories ? -1 : 1));

// this pure function returns 3 colors given the channelID
// returns -> total color , trend color, boundary color
export const plotColorPalette = (channelID) => {
  if (channelID === 0) return ["green", "yellow", "#79eec9"];
  if (channelID === 1) return ["rgb(255, 0, 76)", "white", "#f6aac6"];
  if (channelID === 2) return ["green", "yellow", "#79eec9"];
  return ["green", "yellow", "#79eec9"];
};

export const constructChannelPlot = (
  data,
  boundValues,
  channelID,
  visibility,
  channelVisibility
) => {
  let dataParams = [`total_${channelID + 1}`, `trend_${channelID + 1}`];

  if (data.length === 0) return [];
  if (data[data.length - 1][dataParams[0]] === undefined) return [];

  const total = [];
  const trend = [];
  const x_values = [];
  let upperBound = [];
  let lowerBound = [];

  data.forEach((val) => {
    total.push(val[dataParams[0]]);
    trend.push(val[dataParams[1]]);
    upperBound.push(val[dataParams[1]] + boundValues);
    lowerBound.push(val[dataParams[1]] - boundValues);
    x_values.push(val.x_value);
  });

  const total1 = {
    x: [...x_values],
    y: [...total],
    mode: "lines",
    name: `Channel ${channelID}`,
    visible: channelVisibility,
    line: {
      color: plotColorPalette(channelID)[0],
      dash: "solid",
      width: "5",
    },
  };
  const total1Control = {
    x: [...x_values],
    y: [...total],
    mode: "lines",
    showlegend: false,
    visible:
      total[total.length - 1] <= lowerBound[lowerBound.length - 1] ||
      total[total.length - 1] >= upperBound[upperBound.length - 1]
        ? true
        : false,
    line: {
      color: "rgb(240,255,240)",
      dash: "solid",
      width: "2",
    },
  };

  const trend1 = {
    x: [...x_values],
    y: [...trend],
    mode: "lines",
    visible: channelVisibility,
    name: `Trend ${channelID}`,
    line: {
      color: plotColorPalette(channelID)[1],
      dash: "dot",
    },
  };
  const trend1Upper = {
    x: [...x_values],
    y: [...upperBound],
    mode: "lines",
    name: `Trend ${channelID} Upper Bound`,
    visible: visibility,
    showlegend: false,
    line: {
      color: plotColorPalette(channelID)[2],
    },
  };
  const trend1Lower = {
    x: [...x_values],
    y: [...lowerBound],
    mode: "lines",
    visible: visibility,
    showlegend: false,
    fill: "tonexty",
    name: `Trend ${channelID} Lower Bound`,
    line: {
      color: plotColorPalette(channelID)[2],
    },
  };
  return [total1, total1Control, trend1, trend1Upper, trend1Lower];
};

export const updateChannelPlot = (data, boundValue, channelID) => {
  let y = [];
  let x = [];
  let dataParams = [`total_${channelID + 1}`, `trend_${channelID + 1}`];

  if (data[data.length - 1] === undefined) return { y: [], x: [] };
  if (data[data.length - 1][dataParams[0]] === undefined)
    return { y: [], x: [] };

  y.push([data[data.length - 1][dataParams[0]]]);
  y.push([data[data.length - 1][dataParams[0]]]);
  y.push([data[data.length - 1][dataParams[1]]]);
  y.push([data[data.length - 1][dataParams[1]] + boundValue]);
  y.push([data[data.length - 1][dataParams[1]] - boundValue]);
  // x array must be of the same length of the y array
  y.forEach((val) => {
    x.push([data[data.length - 1].x_value]);
  });

  return {
    y: y,
    x: x,
  };
};

/**
 * Takes an array and returns the sum of all its items
 * @param {*} collection - array of integers
 * @returns sum of items
 */
export const sum = (collection) => {
  let result = 0;
  for (let i = 0; i < collection.length; i++) {
    result += collection[i];
  }
  return result;
};

/**
 * Calculates the simple moving average of a dataset
 * @param {*} dataSet - an array of items of the form:
 *
 * ```javascript
 * [{targetKeyY : 10, targetKeyX : 20, otherKey: n ... }]
 * ```
 * where 10 is the value passed to the window to be averaged out
 * @param {*} targetKeyY - the key of the y-axis of the item to be averages out
 * @param {*} targetKeyX - the key of the x-axis of item to be averages out
 * @param {*} windowSize - the size of the window of the average
 *
 * @returns array of smoothed data
 */
export const calculateSMA = (dataSet, targetKeyY, targetKeyX, windowSize) => {
  const result = [];
  let window = [];
  for (let data of dataSet) {
    window.push(data[`${targetKeyY}`]);
    if (window.length === windowSize) {
      result.push({ y: sum(window) / windowSize, x: data[`${targetKeyX}`] });
      window = [];
    }
  }
  return result;
};

/**
 * This function converts the data from a pd.DataFrame.to_json() format to the following form
 * [ { col:[values, ...]}, .... ]
 *
 * @param {*} backendData - parsed objects from pd.DataFrame.to_json()
 * @returns data - an array which is a collection of objects
 * containing the column as keys and the rows as values
 */
export const convert_df_to_objects = (dataFromBackend) => {
  const columns = Object.keys(dataFromBackend);
  const rows = Object.keys(dataFromBackend[columns[0]]);
  // data should contain a list of object which with the columns and the row
  // [{ col : row, col : row },{ col : row, col : row } ]
  const data = [];
  rows.forEach((r) => {
    let row = {};
    columns.forEach((c) => {
      row[c] = dataFromBackend[c][r];
    });
    data.push(row);
  });

  return data;
};

export const convertFilesToReadableFormat = (userFiles) => {
  let readableUserFiles = [];
  userFiles.forEach((v, k) => {
    let file = userFiles[k].resource_content;
    let fileColumns = Object.keys(file);
    // assuming first row has the same columns of the rest of the rows
    let fileRows = Object.keys(file[fileColumns[0]]);
    let cleanerData = [];
    fileRows.forEach(() => cleanerData.push({}));
    for (let row of fileRows) {
      for (let col of fileColumns) {
        cleanerData[fileRows.indexOf(row)][col] = file[col][row];
      }
    }
    readableUserFiles.push(cleanerData);
  });
  return readableUserFiles;
};

export const convertFilesToEditableFormat = (userFiles) => {
  let tabularFiles = [];
  userFiles.forEach((v, k) => {
    let file = userFiles[k].resource_content;
    let fileColumns = Object.keys(file);
    // assuming first row has the same columns of the rest of the rows
    let fileRows = Object.keys(file[fileColumns[0]]);
    let cleanerData = [];

    fileColumns.forEach((_) => {
      cleanerData.push({});
    });

    fileColumns.forEach((col, index) => {
      cleanerData[index][`${col}`] = [];
      fileRows.forEach((row) => {
        cleanerData[index][`${col}`].push(file[col][row]);
      });
    });
    tabularFiles.push(cleanerData);
  });
  return tabularFiles;
};

export const convertFilesToTabularFormat = (userFiles) => {
  let tabularFiles = [];
  userFiles.forEach((v, k) => {
    let file = userFiles[k].resource_content;
    let fileColumns = Object.keys(file);
    // assuming first row has the same columns of the rest of the rows
    let fileRows = Object.keys(file[fileColumns[0]]);
    let cleanerData = [];

    fileColumns.forEach((_) => {
      cleanerData.push({});
    });

    fileColumns.forEach((col, index) => {
      cleanerData[index][`${col}`] = [];
      fileRows.forEach((row) => {
        cleanerData[index][`${col}`].push(file[col][row]);
      });
    });
    tabularFiles.push(cleanerData);
  });

  let result = [];
  tabularFiles.forEach((file) => {
    let resultFile = {};
    file.forEach((col) => {
      const column = Object.keys(col);
      resultFile[column[0]] = col[column[0]];
    });
    result.push(resultFile);
  });

  return result;
};

/**
 * this function can be used to store the data of an image element in localStorage,
 * to implement the function you can write the following code
 * ```javascript
 * const bannerImage = document.getElementById("bannerImg");
 * const imgData = getBase64Image(bannerImage);
 * localStorage.setItem("imgData", imgData);
 * ```
 * to get the image you can write the following code
 * ```javascript
 * const dataImage = localStorage.getItem("imgData");
 * const bannerImg = document.getElementById("tableBanner");
 * bannerImg.src = "data:image/png;base64," + dataImage
 * ```
 * @param {*} img - HTML image element parsed from the DOM
 * @returns object which can be stored to local storage
 */
export const getBase64Image = (img) => {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
};

export const removeDuplicatesInArray = (arr) => {
  let newArr = new Set(arr);
  return Array.from(newArr);
};
