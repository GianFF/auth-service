const mockConsole = () => {
  let writtenMessages = [];
  jest.spyOn(console, 'log').mockImplementation((messageToLog) => {
    writtenMessages.push(messageToLog);
  });
};


module.exports = {
  mockConsole,
};
