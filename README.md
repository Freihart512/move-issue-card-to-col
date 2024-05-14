# Move Project Card into a Specific column

this action detects an issue event finds a card related to the issue in the project that you specific and moves it to a specific column

use cases

when an issue is assigned move the card into in progress
when an issue is closed move the card into done

## Usage

```yaml
uses: actions/javascript-action@v1
with:
    uses: Freihart512/move-linked-pr-issue@v0.0.35
    with: 
      project_number: 1
      user_name: Freihart512
      personal_token: ${{secrets.PERSONAL_TOKEN}}
      target_col: In Progress
```

### Note: PERSONAL_TOKEN
you need to create a personal token with project permisson tpo be able to move the card

you can create one here [github developer settings](https://github.com/settings/tokens)

See the [actions tab](https://github.com/actions/javascript-action/actions) for runs of this action! :rocket:
