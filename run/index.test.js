const { run } = require('./index.js');
const core = require('@actions/core');
const { mockFn } = require('octokit');

const mutationResponse = {
  updateProjectV2ItemFieldValue: {
    projectV2Item: { id: 'PVTI_lAHOANGp0s4ATT8yzgIYlf4' },
  },
};

const issueInfo = {
  user: {
    repository: {
      issue1: {
        title: '[Task]:  Testing Actions',
        createdAt: '2023-08-06T15:50:41Z',
        id: 'I_kwDOJ4bThM5tkZGt',
        projectV2: {
          id: 'PVT_kwHOANGp0s4ATT8y',
          title: 'Scrapper Infracciones',
          field: {
            __typename: 'ProjectV2SingleSelectField',
            id: 'PVTSSF_lAHOANGp0s4ATT8yzgMVbsY',
            options: [
              { id: 'c1a353c4', name: 'Backlog' },
              { id: 'f75ad846', name: 'Todo' },
              { id: '47fc9ee4', name: 'In Progress' },
              { id: '6d23dd3c', name: 'In code Review' },
              { id: '98236657', name: 'Done' },
            ],
          },
        },
        projectItems: {
          __typename: 'ProjectV2ItemConnection',
          nodes: [
            {
              type: 'ISSUE',
              id: 'PVTI_lAHOANGp0s4ATT8yzgIYlf4',
              content: {
                __typename: 'Issue',
                number: 33,
                id: 'I_kwDOJ4bThM5tkZGt',
                title: '[Task]:  Testing Actions',
              },
            },
          ],
        },
      },
    },
  },
};

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
//   info: jest.fn((message) => console.log(message)),
//   error: jest.fn((message) => console.log(message)),
//   setFailed: jest.fn((message) => console.log(message)),
// }));

jest.mock('@actions/github', () => {
  return {
    context: {
      issue: {
        repo: 'HOLAAAA',
        number: 500,
      },
    },
  };
});

jest.mock('octokit', () => {
  return (() => {
    const mockFn = jest.fn();
    return {
      Octokit: class {
        graphql = mockFn;
      },
      mockFn,
    };
  })();
});

describe.only('run', () => {
  it('if project item was found change its status', async () => {
    // getInfoFromIssue
    mockFn.mockImplementationOnce(() => issueInfo);
    // moveItemToStatus
    mockFn.mockImplementationOnce(() => mutationResponse);

    await run();
    const mostRecentCall = core.info.mock.lastCall;
    expect(mostRecentCall[0]).toBe(
      'Issue [[Task]:  Testing Actions] moved successfully'
    );
  });

  it('if project item was found change its status', async () => {
    // getInfoFromIssue
    mockFn.mockImplementationOnce(() => issueInfo);
    // moveItemToStatus
    mockFn.mockImplementationOnce(() => mutationResponse);
    const spyGetInput = jest.spyOn(core, 'getInput');
    spyGetInput.mockImplementation((inputName) => {
      switch (inputName) {
        case 'project_number':
          return 'HOLAA';
        case 'user_name':
          return 'testUser';
        case 'target_col':
          return 'In Progress';
        case 'personal_token':
          return 'personal_token';
        default:
          return '';
      }
    });

    await run();
    const mostRecentCall = core.setFailed.mock.lastCall;
    expect(mostRecentCall[0]).toBe(
      'ProjectNumber must be a positive number, value: HOLAA'
    );
  });
});
