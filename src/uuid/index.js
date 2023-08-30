const { v4: uuidv4 } = require('uuid');

const fakeUUIDGenerator = {
  generate: () => '123',
};

const prodUUIDGenerator = {
  generate: () => uuidv4(),
};

module.exports = {
  fakeUUIDGenerator,
  prodUUIDGenerator,
};
