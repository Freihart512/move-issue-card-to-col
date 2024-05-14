const core = require('@actions/core');
const {
  validateInput,
  getInputsValues,
  extractSummaryProjectFromIssue,
  extractISummaryIssue,
  getTargetColFromProject,
} = require('./helpers.js');

// jest.mock('@actions/core', () => ({
//   getInput: jest.fn().mockImplementation((inputName) => {
//     switch (inputName) {
//       case 'project_number':
//         return 123;
//       case 'user_name':
//         return 'testUser';
//       case 'target_col':
//         return 'In Progress';
//       case 'personal_token':
//         return 'personal_token';
//       default:
//         return '';
//     }
//   }),
// }));

describe('validateInput function', () => {
  it('should throw an error for an empty string', () => {
    expect(() => {
      validateInput('', 'fieldName');
    }).toThrowError('fieldName must be a non-empty string, value: ');
  });

  it('should not throw an error for a non-empty string', () => {
    expect(() => {
      validateInput('Hello', 'fieldName');
    }).not.toThrow();
  });
});

describe('getInputsValues function', () => {
  it('should return an object with all input values', () => {
    const inputs = getInputsValues();
    expect(inputs).toEqual({
      projectNumber: 123,
      userName: 'testUser',
      targetColName: 'In Progress',
      personalToken: 'personal_token',
    });
  });

  it('should throw an error if projectNumber is not a positive number', () => {
    const spyGetInput = jest.spyOn(core, 'getInput');
    spyGetInput.mockImplementation((inputName) => {
      switch (inputName) {
        case 'project_number':
          return 'project_number';
        case 'user_name':
          return 'HOLAAA';
        case 'target_col':
          return 'In Progress';
        case 'personal_token':
          return 'token_personal';
        default:
          return '';
      }
    });
    expect(() => getInputsValues()).toThrowError(
      'ProjectNumber must be a positive number, value: project_number'
    );
  });
});

describe('extractSummaryProjectFromIssue function', () => {
  it('should return project info from issue', () => {
    const issue = {
      user: {
        repository: {
          issue1: {
            projectV2: {
              title: 'Project Title',
              id: 'projectID',
              field: {
                id: 'fieldID',
                options: [
                  { id: 'col1ID', name: 'Column 1' },
                  { id: 'col2ID', name: 'Column 2' },
                ],
              },
            },
          },
        },
      },
    };
    const project = extractSummaryProjectFromIssue(issue);
    expect(project).toEqual({
      name: 'Project Title',
      id: 'projectID',
      statusFieldId: 'fieldID',
      cols: [
        { id: 'col1ID', name: 'Column 1' },
        { id: 'col2ID', name: 'Column 2' },
      ],
    });
  });

  it('should throw an error if project id is not found', () => {
    const issue = {
      user: {
        repository: {
          issue1: {
            projectV2: {
              title: 'Project Title',
              field: {
                id: 'fieldID',
                options: [],
              },
            },
          },
        },
      },
    };
    expect(() => {
      extractSummaryProjectFromIssue(issue);
    }).toThrowError(
      'Error extractSummaryProjectFromIssue: Project id was not found.'
    );
  });
});

describe('extractISummaryIssue function', () => {
  it('should return issue summary from issue', () => {
    const issue = {
      user: {
        repository: {
          issue1: {
            id: 'issueID',
            title: 'Issue Title',
            projectItems: {
              nodes: [{ id: 'projectItemID' }],
            },
          },
        },
      },
    };
    const summary = extractISummaryIssue(issue);
    expect(summary).toEqual({
      id: 'issueID',
      title: 'Issue Title',
      projectItemId: 'projectItemID',
    });
  });

  it('should throw an error if issue id is not found', () => {
    const issue = {
      user: {
        repository: {
          issue1: {
            title: 'Issue Title',
            projectItems: {
              nodes: [{ id: 'projectItemID' }],
            },
          },
        },
      },
    };
    expect(() => {
      extractISummaryIssue(issue);
    }).toThrowError('Issue Id was not found.');
  });

  it('should throw an error if project item nodes does not have items ', () => {
    const issue = {
      user: {
        repository: {
          issue1: {
            id: 'issueID',
            title: 'Issue Title',
            projectItems: {
              nodes: [],
            },
          },
        },
      },
    };
    expect(() => {
      extractISummaryIssue(issue);
    }).toThrowError(
      // eslint-disable-next-line quotes
      `Error extractISummaryIssue: Cannot read properties of undefined (reading 'id')`
    );
  });

  it('should throw an error if project item nodes has items', () => {
    const issue = {
      user: {
        repository: {
          issue1: {
            id: 'issueID',
            title: 'Issue Title',
            projectItems: {
              nodes: [{}],
            },
          },
        },
      },
    };
    expect(() => {
      extractISummaryIssue(issue);
    }).toThrowError(
      // eslint-disable-next-line quotes
      `Error extractISummaryIssue: Project item for the issue was not found.`
    );
  });
});

describe('getTargetColFromProject function', () => {
  it('should return target column from project', () => {
    const project = {
      cols: [
        { id: 'col1ID', name: 'Column 1' },
        { id: 'col2ID', name: 'Column 2' },
      ],
    };
    const targetColName = 'Column 1';
    const targetCol = getTargetColFromProject(project, targetColName);
    expect(targetCol).toEqual({ id: 'col1ID', name: 'Column 1' });
  });

  it('should throw an error if target column is not found', () => {
    const project = {
      cols: [
        { id: 'col1ID', name: 'Column 1' },
        { id: 'col2ID', name: 'Column 2' },
      ],
    };
    const targetColName = 'Invalid Column';
    expect(() => {
      getTargetColFromProject(project, targetColName);
    }).toThrowError('Target colum [Invalid Column] was not found.');
  });
});
