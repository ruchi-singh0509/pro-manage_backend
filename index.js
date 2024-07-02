const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const connectDB = require('./config/database');
const userRoute = require('./routes/userRoutes');
const taskRoute = require('./routes/taskRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '' }));
app.use('/api/', userRoute);
app.use('/api/', taskRoute);

app.get('/', (req, res) => {
  let time = new Date().toLocaleTimeString();
  res.json({
    time: time,
    app: 'pro-manage_backend',
    state: 'Active',
    message: 'All good!',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
  connectDB();
  console.log(`Server is running on PORT ${PORT}`);
});

app.get('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
