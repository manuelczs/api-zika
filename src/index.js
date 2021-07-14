const server = require('./server');
const port = process.env.PORT || 3000;

const init = async () => {
  try {
    await server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

init();