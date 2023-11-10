require('dotenv').config()
const app = require('./app')

const init = async () => {
  const PORT = 3000
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

init()