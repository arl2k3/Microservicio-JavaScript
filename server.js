const express = require('express');
const prisma = require('@prisma/client');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World! Microservicio JS');
});
app.use('/api/v1/users', userRoutes);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});


