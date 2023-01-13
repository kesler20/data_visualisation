# The Front End of Journal v-0.1

The application can be found [here](http://journalui-20220906230712-hostingbucket-dev.s3-website.eu-west-2.amazonaws.com)

![Tests](https://github.com/uos-datavisdashboard/journal_frontend/actions/workflows/node.js.yml/badge.svg)

The documentation for the awmplify cli is https://docs.amplify.aws/cli/start/install/

## Setting Up Amplify Application

### Configure User

To set up the aws amplify application locally you can run the following commands
if you have not configured a user yet you can use the following command

```bash
amplify configure
```

you can configure the application using the credentials found [here](https://docs.google.com/spreadsheets/d/1e9bV1FTvJm78Ze7AGO5t0GXSDWCh6_oXjspYeo-a5YQ/edit#gid=1565451782)
this IAM user will have the required permissions for the application

### Initialising the application

the application can be started in two ways, using

```bash
amplify pull d33isupz2kpt8q
```

or by running

```bash
amplify init
```

with the latter alternative being easier and safer to run

### Importing categories

to import categories individually you can run

```bash
amplify import <category>
```

where the current existing categories correspond to the following
| Category | ID/Name |  
| --- | --- |
| Auth | `eu-west-2_41z8aLc9G` |
| Storage | `test-20220728140647-hostingbucket-dev` |
| Storage (database) | `dynamo28f97260-dev` |

however the above categories may change as such see the configuration file in the backend
https://github.com/kesler20/test_backend/blob/master/src/journal/config_file.py
for updates

### Publish the application

finally to publish the application add the hosting category and run

```bash
amplify publish
```

the application hostingbucket is "journalui-20220906230712-hostingbucket"

### OTHER DEV INSTRUCTIONS

- when you are in the main branch make sure that the process.env variable is switched to
  production such that the backend which the front-end listens to is the correct one

### Launching the application locally

To launch the application locally you will get a Buffer not defined error in the console after running

```bash
npm install
```

and

```bash
npm start
```

this is due to an error in the mqtt library, to fix this
you can cd into the library

```bash
cd node_modules/mqtt
```

create the webpack configuration

```bash
echo > webpack.config.js
```

paste the following code

```javascript
const webpack = require("webpack");

module.exports = {
  entry: "./lib/connect/index.js",

  //mode: "development",

  output: {
    library: {
      type: "commonjs2",
    },
    filename: "mqtt.browser.js",
  },

  plugins: [
    // fix "process is not defined" error:
    // (do "npm install process" before running the build)
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],

  resolve: {
    fallback: {
      assert: require.resolve("assert"),
      buffer: require.resolve("buffer"),
      console: require.resolve("console-browserify"),
      constants: require.resolve("constants-browserify"),
      crypto: require.resolve("crypto-browserify"),
      domain: require.resolve("domain-browser"),
      events: require.resolve("events"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      path: require.resolve("path-browserify"),
      punycode: require.resolve("punycode"),
      process: require.resolve("process/browser"),
      querystring: require.resolve("querystring-es3"),
      stream: require.resolve("stream-browserify"),
      string_decoder: require.resolve("string_decoder"),
      sys: require.resolve("util"),
      timers: require.resolve("timers-browserify"),
      tty: require.resolve("tty-browserify"),
      url: require.resolve("url"),
      util: require.resolve("util"),
      vm: require.resolve("vm-browserify"),
      zlib: require.resolve("browserify-zlib"),
    },
  },
};
```

then
inside of `node_modules/mqtt/package.json`
find where they are specfiying the browser and the following

```json
{
  ...
  "type": "commonjs",
  "browser": {
    "./mqtt.js": "./dist/mqtt.browser.js"
    ...
  }
  ...
}
```

inside of `node_modules/mqtt` execute

```npm
npm i
npm i buffer process
npm i webpack webpack-cli
npx webpack
```

delete `node_modules/.cache` folder
then run npm start again.

run

```bash
amplify init
```

when you import the application locally

### Dashboard Builder notes

## Exampole of a dashboard Builder

using React Grid Layout, Plotly and Matrerial ui

todos

- include tools
- fix the bug of clicking outside the drop down menus
- allow dashboard to save
- make a list of new bugs
- the interactivity tool is not visible at the start
- the interactivity tool can have replicas of the same tool
- add object to layout.js when a new object is added to the dashboard array
- decouple the creation of the plots
- make sure that the other plots are updated adequately when they change with the right useEffects
- rename the plots property to plotMetadata
- make a them selector at the top
- the dark mode of the interactivity tool panel is
  not nice, make sre to include something line a theme selector and a filename selector
- add new tools
- add all the plots which plotly is capable of handling
- rename things
- there is no way to remove the tools once they have been selected
- the tools are not saved

```javascript
plotly.addPlotTitle(currentFile);
plotly.addTrace("scatter3d", "test trace 2");

plotly.addAxisDimension("y", [0, 1, 3, 3, 3, 5, 6, 2, 8, 9], "space", 0);
plotly.addAxisDimension("x", [1, 1, 2, 3, 4, 5, 6, 7, 8, 9], "space", 0);
plotly.addAxisDimension("z", [1, 1, 2, 3, 4, 5, 6, 7, 8, 9], "space", 0);
plotly.addScatterPlot(0);
plotly.addColorDimension([0, 1, 3, 3, 3, 5, 6, 2, 8, 9], 0);
plotly.addSizeDimension([0, 1, 3, 3, 3, 5, 6, 2, 8, 9], 0);
plotly.constructInitialPlot();
```

perhaps go back to the architecture of having a useEffect of building the plots on the plotComponent
perhaps change the dashboardBuilder back to te model as the builder functionality is not working and has not been used
find another way to update the dashboard
work on the interactivity tool, can i have multiple tools from different panels?

app ID = d37f5mo61ci10i
IAM user : user-admin
environment : dev


make sure that when you start an amplify workflow you are at the root directory of the project, 
this is to avoid amplifyu creating files inside the public or otyher directories

make sure that if you have an ammplication which depends on aws you use the aws cli as if you build it without the cli 
application import it will nnot have the aws-exports folder

amplifyconsole-backend-role

remember toi ensure that the environment variables are updated according to what you need

for building the app locally you can use
```bash
amplify pull --appId d37f5mo61ci10i --envName dev
```