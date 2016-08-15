/* eslint-disable global-require */
import express from 'express';
import { Lambda } from 'aws-sdk';
import { match } from 'react-router';
import saga from '../app/sagas';
let routes = require('../app/routes').default;
let renderPage = require('./renderer').default;
let store = require('../app/store').default;

store.sagaMiddleware.run(saga);

const lambdaClient = new Lambda({
  region: 'eu-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const app = express();
const port = 3000;

if (module.hot) {
  module.hot.accept('../app/routes', () => {
    routes = require('../app/routes').default;
  });
  module.hot.accept('./renderer', () => {
    renderPage = require('./renderer').default;
  });
  module.hot.accept('../app/store', function() {
    store = require('../app/store').default;
  });
}

app.get('*', (req, res, next) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      next(err);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      return res.send(renderPage(renderProps, store.store));
    }
  });
});

app.post('/spawn-agent', (req, res, next) => {
  // setTimeout(() => {
  //   res.header('Content-Type', 'application/json');
  //   res.send({ id: 'whatever' });
  // }, 2000)
  lambdaClient.invoke({
    FunctionName: 'webapptest_agents',
    Payload: JSON.stringify({ url: 'some URL!!' })
  }, (err, data) => {
    console.log(err, data);
  })
})

app.use((err, req, rest, next) => {
  console.log(err)
})

app.listen(port, () => {
  console.log(`App server listening on port ${port}`);
});

export default app;
