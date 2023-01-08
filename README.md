This is a react template which uses tailwind and aws
font awesome can be used for icons as iti s a cdn and it offers icons brands
various packages have already been installed and configured
the python file enables continuous depoloytment

Amplify documentation https://docs.amplify.aws/lib/q/platform/js/

make sure that you are on the right path, do not run the commands from src
start by using amplify init if the user that you want to use already exists
us amplify pull if the app that you want to use already exist
use amplify configure if the either the app nor the uiser that you want to use already exist

do not use ampolify puyl before pushing the first commiut, this will remove all the current changes thyat you made
to the amplify application

to run the workflow use which will:

- run tests
- format code
- pull the latest changes
- push code to github
- publish the application
  by running:

```bash
python workflow.py
```

before ensure that prettier has being installed by running

```bash
npm install -g prettier
```

ensure that jest is installed by running

```bash
npm install --save-dev jest
```
