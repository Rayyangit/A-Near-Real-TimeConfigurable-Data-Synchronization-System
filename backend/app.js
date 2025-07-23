const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
const bodyParser = require('body-parser');
const syncData = require('./sync/syncEngine');
const sequelize = require('./sequelize');
const { SYNC_CRON } = require('./config');
const { LocalData, CloudData } = require('./models/DataModel');

const app = express();
app.use(bodyParser.json());
app.use(cors());
sequelize.sync({ alter: true }) // or { force: true } for resetting
  .then(() => {
    console.log('[DB] MySQL Connected and Tables Synced');
    cron.schedule(SYNC_CRON, syncData);
  })
  .catch(err => console.error('[DB] MySQL Connection Error:', err));

// API Endpoints
app.post('/local', async (req, res) => {
  const { id, data } = req.body;
  const [doc] = await LocalData.upsert({ id, data, lastModified: new Date() });
  res.json(doc);
});

app.post('/cloud', async (req, res) => {
  const { id, data } = req.body;
  const [doc] = await CloudData.upsert({ id, data, lastModified: new Date() });
  res.json(doc);
});

app.get('/local', async (req, res) => res.json(await LocalData.findAll()));
app.get('/cloud', async (req, res) => res.json(await CloudData.findAll()));

app.listen(5000, () => console.log('[Server] Running on port 5000'));
