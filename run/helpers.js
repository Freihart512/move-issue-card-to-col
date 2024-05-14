const core = require('@actions/core');
const { validateNumber, validateString } = require('../utils');

/**
 * Validates if a value is a non-empty string.
 * @param {string} value - The value to validate.
 * @param {string} fieldName - The name of the field being validated.
 */
function validateInput (value, fieldName) {
  if (!validateString(value)) {
    throw new Error(`${fieldName} must be a non-empty string, value: ${value}`);
  }
}

/**
 * getInputsValues:
 * is a function to get all action parameters
 * @returns {object} { projectNumber, userName, targetColName, githubToken, personalToken }
 * @example
 * getInputsValues()
 */
function getInputsValues () {
  const projectNumber = core.getInput('project_number');
  if (!validateNumber(projectNumber, true)) {
    throw new Error(
      `ProjectNumber must be a positive number, value: ${projectNumber}`
    );
  }

  const userName = core.getInput('user_name');
  validateInput(userName, 'userName');
  const targetColName = core.getInput('target_col');
  validateInput(targetColName, 'targetColName');

  const personalToken = core.getInput('personal_token');
  validateInput(personalToken, 'personalToken');

  return {
    projectNumber,
    userName,
    targetColName,
    personalToken,
  };
}

/**
 * extractSummaryProjectFromIssue:
 * is a function to get project info from issue.
 * @param {object} issue -  github issue.
 * @returns {object} { name, id, statusFieldId, cols }
 * @example
 * extractSummaryProjectFromIssue(issue)
 */
function extractSummaryProjectFromIssue (issue) {
  try {
    const fullProjectInfo = issue.user.repository.issue1.projectV2;
    const project = {
      name: fullProjectInfo.title,
      id: fullProjectInfo.id,
      statusFieldId: fullProjectInfo.field.id,
      cols: fullProjectInfo.field.options,
    };

    if (!project.id) {
      throw new Error('Project id was not found.');
    }

    return project;
  } catch (error) {
    throw new Error(`Error extractSummaryProjectFromIssue: ${error.message}`);
  }
}

/**
 * extractSummaryProjectFromIssue:
 * is a function to get summary of issue from issue.
 * @param {object} issue -  github issue.
 * @returns {object} { id, title, projectItemId }
 * @example
 * extractISummaryIssue(issue)
 */
function extractISummaryIssue (issue) {
  try {
    const issue1 = issue.user.repository.issue1;
    const summary = {
      id: issue1.id,
      title: issue1.title,
      projectItemId: issue1.projectItems.nodes[0].id,
    };

    if (!summary.id) {
      throw new Error('Issue Id was not found.');
    }

    if (!summary.projectItemId) {
      throw new Error('Project item for the issue was not found.');
    }

    return summary;
  } catch (error) {
    throw new Error(`Error extractISummaryIssue: ${error.message}`);
  }
}

/**
 * getTargetColFromProject:
 * is a function to get column info from project.
 * @param {object} project -  github project.
 * @param {object} targetColName -  name of the col.
 * @returns {object} { id, name }
 * @example
 * getTargetColFromProject(project, "in progress")
 */
function getTargetColFromProject (project, targetColName) {
  const cols = Array.isArray(project.cols) ? project.cols : [];
  const targetCol = cols.find((col) => col.name === targetColName);
  if (!targetCol) {
    throw new Error(`Target colum [${targetColName}] was not found.`);
  }
  return targetCol;
}

module.exports = {
  getInputsValues,
  extractSummaryProjectFromIssue,
  extractISummaryIssue,
  getTargetColFromProject,
  validateInput,
};
