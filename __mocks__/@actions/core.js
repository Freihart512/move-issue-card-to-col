module.exports = {
  getInput: jest.fn().mockImplementation((inputName) => {
    switch (inputName) {
      case 'project_number':
        return 123;
      case 'user_name':
        return 'testUser';
      case 'target_col':
        return 'In Progress';
      case 'personal_token':
        return 'personal_token';
      default:
        return '';
    }
  }),
  info: jest.fn((message) => console.log(message)),
  error: jest.fn((message) => console.log(message)),
  setFailed: jest.fn((message) => console.log(message)),
};
