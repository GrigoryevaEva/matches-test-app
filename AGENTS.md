This is a small Expo / React Native test project (Expo SDK 57, single screen, no router). It runs in a browser (`npm run web`) and in Expo Go.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. Before writing code that touches an Expo or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt and follow its links; never answer from memory.

## Commands

```bash
npx expo install <package>  # use instead of npm install <package> — picks SDK-compatible versions
npm run web                 # run in a browser
npm start                   # run in Expo Go
npx tsc --noEmit            # typecheck
npx expo lint               # lint
```

Run typecheck before declaring a task done. Do not add native modules that need a development build — the app must keep working in Expo Go.

## Agent skills

### Issue tracker

Track issues and specs locally under `.scratch/<feature>/`. Before reading or publishing tickets, read `docs/agents/issue-tracker.md`.

### Triage labels

Use the five standard triage roles. Before triaging issues, read `docs/agents/triage-labels.md`.

### Domain docs

Use a single-context layout: root `GLOSSARY.md` and `docs/adr/`. Before exploring the codebase, read `docs/agents/domain.md`.

## Readability and review workflow

Put every property of a style object on its own line, including existing styles. Use a 120-character source-line limit. Wrap long JSX and expressions; separate logical groups with blank lines. Follow the existing functional component, TypeScript and StyleSheet conventions, and extract repeated layout or logic when useful.

Maintain Storybook stories with the real components they demonstrate. Run typecheck and the behavioural checks relevant to the current ticket before presenting it for review.

Implement one ticket per commit. Complete the current branch, then present the entire branch for user review before starting another branch. Use feature/matches-screen, then separate fix/favorites and fix/updated-ago branches based on the completed feature.

Keep the working source URL and SOLUTION.md draft as visible, unstaged local changes. Stage explicit paths and inspect the staged diff before every commit to keep both changes out of commit history. Discuss SOLUTION.md with the user last, before separately approving its inclusion. Keep all work local until the user requests publication.
