const fetch = require('node-fetch');
const { Octokit } = require('octokit');
class GraphqlApi {
  constructor (token) {
    this.octokit = new Octokit({ auth: token, request: { fetch } });
  }

  query (q) {
    return this.octokit.graphql(q);
  }
}

module.exports = GraphqlApi;
