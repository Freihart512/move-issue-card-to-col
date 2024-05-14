const core = require('@actions/core');
const github = require('@actions/github');
const GraphqlApi = require('../graphql');
const { getInfoFromIssue } = require('../graphql/queries');
const { moveItemToStatus } = require('../graphql/mutations');
const {
  getInputsValues,
  extractSummaryProjectFromIssue,
  extractISummaryIssue,
  getTargetColFromProject,
} = require('./helpers');

/**
 * entry point
 */
async function run () {
  try {
    const {
      projectNumber,
      userName,
      targetColName,
      personalToken,
    } = getInputsValues();

    const { repo: repoName, number: entityNumber } = github.context.issue;
    const token = personalToken;

    const graphqlInstance = new GraphqlApi(token);
    core.info('Getting issue info...');
    const issueInfoQuery = getInfoFromIssue(
      userName,
      repoName,
      entityNumber,
      projectNumber
    );
    const issueInfoResponse = await graphqlInstance.query(issueInfoQuery);
    const project = extractSummaryProjectFromIssue(issueInfoResponse);
    const issue = extractISummaryIssue(issueInfoResponse);
    const targetCol = getTargetColFromProject(project, targetColName);

    core.info(`Moving issue [${issue.title}] to ${targetColName}`);
    const moveItemMutation = moveItemToStatus(
      project.id,
      issue.projectItemId,
      project.statusFieldId,
      targetCol.id
    );
    await graphqlInstance.query(moveItemMutation);
    core.info(`Issue [${issue.title}] moved successfully`);
  } catch (error) {
    core.error(`Failed to execute action: ${error}`);
    core.setFailed(error.message);
  }
}

module.exports = {
  run,
};
