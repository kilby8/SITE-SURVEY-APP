'use strict';

require('dotenv').config();
const { app, initSchema } = require('./app');

const PORT = parseInt(process.env.PORT || '3000', 10);

initSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Site Survey API listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database schema:', err);
    process.exit(1);
  });
