# 🌍 How to Contribute to Open Source — A Step-by-Step Guide

> Written for: Rahil  
> Date: March 2026  
> Level: Beginner → Intermediate  
> Stack focus: JavaScript / Node.js / React

---

## 📖 Table of Contents

1. [What Is Open Source?](#1-what-is-open-source)
2. [Why Contribute?](#2-why-contribute)
3. [What You Need Before Starting](#3-what-you-need-before-starting)
4. [Finding the Right Project](#4-finding-the-right-project)
5. [Understanding a Repository](#5-understanding-a-repository)
6. [The Full Contribution Workflow](#6-the-full-contribution-workflow)
7. [Writing Good Code for Open Source](#7-writing-good-code-for-open-source)
8. [Writing a Great Pull Request](#8-writing-a-great-pull-request)
9. [What Happens After You Submit](#9-what-happens-after-you-submit)
10. [Types of Contributions (with Examples)](#10-types-of-contributions-with-examples)
11. [Common Mistakes to Avoid](#11-common-mistakes-to-avoid)
12. [Git Commands Cheatsheet](#12-git-commands-cheatsheet)
13. [Recommended Starter Repos](#13-recommended-starter-repos)
14. [Golden Rules](#14-golden-rules)

---

## 1. What Is Open Source?

Open source software is code that is publicly available for anyone to read, use, modify, and distribute. Projects like **Node.js**, **React**, **Express**, **MongoDB drivers**, and millions of npm packages you use every day are open source.

When you contribute, you are improving software that potentially millions of developers rely on — and building a real public track record of your skills.

---

## 2. Why Contribute?

- ✅ Build a real portfolio beyond personal projects
- ✅ Learn how professional codebases are structured
- ✅ Get code reviewed by experienced engineers (for free)
- ✅ Understand how teams collaborate at scale
- ✅ Network with developers worldwide
- ✅ Strengthen your GitHub profile (matters to recruiters)
- ✅ Give back to tools you use daily

---

## 3. What You Need Before Starting

### Tools
- [ ] **Git** installed and configured
- [ ] **GitHub account** (free)
- [ ] **Node.js / npm** (you already have this)
- [ ] A code editor (VS Code)

### Git Identity Setup (do this once)
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### GitHub SSH Setup (optional but recommended)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your@email.com"

# Copy the public key and add it on GitHub → Settings → SSH Keys
cat ~/.ssh/id_ed25519.pub
```

---

## 4. Finding the Right Project

### Rule #1 — Start Small
Do NOT try to contribute to React, Node.js core, or VS Code on your first try. Start with smaller, friendlier projects.

### Where to Find Issues

| Platform | Link | What It Does |
|---|---|---|
| Good First Issue | https://goodfirstissue.dev | Curated beginner issues by language |
| Up For Grabs | https://up-for-grabs.net | Filtered by tech stack |
| GitHub Explore | https://github.com/explore | Filter by `good first issue` label |
| CodeTriage | https://www.codetriage.com | Get one issue per day by email |
| First Contributions | https://firstcontributions.github.io | Guided practice repo |

### Best Strategy — Use What You Already Know
Look at the packages in your own `package.json`. You already use:
- `express` — https://github.com/expressjs/express
- `mongoose` — https://github.com/Automattic/mongoose
- `jsonwebtoken` — https://github.com/auth0/node-jsonwebtoken
- `bcryptjs` — https://github.com/dcodeIO/bcrypt.js

Contributing to tools you use means you already understand the context.

### How to Filter Issues on GitHub
1. Go to any repo on GitHub
2. Click the **Issues** tab
3. Click **Labels** → select `good first issue` or `help wanted`
4. Filter by `is:open` and `is:unassigned`

---

## 5. Understanding a Repository

Before writing a single line of code, spend time reading:

### Files to Read First
```
README.md           ← What the project does, how to run it
CONTRIBUTING.md     ← The rules for contributing (VERY important)
CODE_OF_CONDUCT.md  ← Community rules (respect them)
LICENSE             ← Legal terms of the project
package.json        ← Dependencies and scripts
```

### Questions to Answer
- How do I set up the project locally?
- How do I run the tests?
- What coding style do they use (ESLint, Prettier)?
- Do they use TypeScript?
- Is there a Discord / Slack for contributors?

### Run the Project Locally First
You should **never submit a PR without running the project locally**. If you can't get it running, ask in the issues first.

---

## 6. The Full Contribution Workflow

This is the exact sequence of steps every time you contribute.

---

### Step 1 — Find an Issue and Claim It

1. Go to the repo's Issues tab
2. Find an issue labelled `good first issue` or `help wanted`
3. Read the full issue thread — someone might already be working on it
4. **Comment on the issue**: "Hi, I'd like to work on this. I'll have a PR ready in X days."
5. Wait for a maintainer to assign it to you (or just go ahead if it's clearly unclaimed)

> 💡 **Why comment first?** It prevents two people writing the same fix. Maintainers appreciate it.

---

### Step 2 — Fork the Repository

A **fork** is your own personal copy of the repo on GitHub.

1. Go to the project on GitHub
2. Click the **Fork** button (top right)
3. Click **Create Fork**

You now have `https://github.com/YOUR_USERNAME/repo-name`

---

### Step 3 — Clone Your Fork Locally

```bash
# Clone YOUR fork (not the original)
git clone https://github.com/YOUR_USERNAME/repo-name.git

# Navigate into it
cd repo-name
```

---

### Step 4 — Add the Original Repo as "upstream"

This lets you pull in changes from the original repo later.

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/repo-name.git

# Verify your remotes
git remote -v
# Should show:
# origin    https://github.com/YOUR_USERNAME/repo-name.git
# upstream  https://github.com/ORIGINAL_OWNER/repo-name.git
```

---

### Step 5 — Create a New Branch

**Never work on `main` directly.** Always create a dedicated branch.

```bash
# Make sure you're on main and up to date
git checkout main
git pull upstream main

# Create and switch to a new branch
# Name it descriptively
git checkout -b fix/auth-token-expiry
# or
git checkout -b feat/add-clip-score
# or
git checkout -b docs/update-readme
```

#### Branch Naming Convention
```
fix/short-description       ← for bug fixes
feat/short-description      ← for new features
docs/short-description      ← for documentation
test/short-description      ← for adding tests
refactor/short-description  ← for code refactoring
chore/short-description     ← for maintenance tasks
```

---

### Step 6 — Set Up the Project

```bash
# Install dependencies
npm install

# Copy environment variables if needed
cp .env.example .env

# Run existing tests to make sure everything passes before you touch anything
npm test
```

> ⚠️ If tests fail before you make any changes, report it in the issue. Don't try to fix it silently.

---

### Step 7 — Make Your Changes

- Write the code
- Follow the project's existing code style
- Keep changes **focused** — only change what the issue asks for
- Do not refactor unrelated code
- Do not fix other bugs while fixing this one (open separate PRs)

---

### Step 8 — Write or Update Tests

Most projects require tests. Check if there's a `__tests__` or `test/` directory.

```bash
# Run tests as you go
npm test

# Run a specific test file
npm test -- --testPathPattern=auth
```

If you added a new feature, add a test for it.
If you fixed a bug, add a test that would have caught it.

---

### Step 9 — Commit Your Changes

#### Commit Message Format (Conventional Commits)
Most projects use this standard:
```
type(scope): short description

longer description if needed

Fixes #123
```

Examples:
```bash
git commit -m "fix(auth): correct JWT expiry handling"
git commit -m "feat(clips): add clipScore field to model"
git commit -m "docs(readme): add API usage examples"
git commit -m "test(users): add tests for deleteUser endpoint"
```

#### Types
| Type | When to Use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `test` | Adding or fixing tests |
| `refactor` | Code change that's neither fix nor feature |
| `chore` | Build process, dependencies |
| `style` | Formatting only (no logic change) |

---

### Step 10 — Push to Your Fork

```bash
git push origin fix/auth-token-expiry
```

---

### Step 11 — Open a Pull Request

1. Go to your fork on GitHub
2. You'll see a yellow banner: **"Compare & pull request"** → click it
3. Make sure the base is the **original repo's `main`** branch
4. Fill in the PR template (see Section 8 below)
5. Click **Create Pull Request**

---

### Step 12 — Respond to Review Feedback

Maintainers will likely leave comments requesting changes. This is normal. Do not take it personally.

```bash
# Make the requested changes locally
# Then add and commit them
git add .
git commit -m "fix: address review feedback"
git push origin fix/auth-token-expiry
```

The PR updates automatically — no need to close and reopen it.

---

### Step 13 — Keep Your Branch Up to Date

If the main branch gets new commits while your PR is open:

```bash
git fetch upstream
git rebase upstream/main
git push origin fix/auth-token-expiry --force-with-lease
```

> Use `--force-with-lease` instead of `--force` — it's safer.

---

### Step 14 — PR Gets Merged 🎉

Once approved, a maintainer will merge your PR. You'll get a notification.

**Clean up:**
```bash
# Switch back to main
git checkout main

# Pull the updated main
git pull upstream main

# Delete your local branch (it's merged, no longer needed)
git branch -d fix/auth-token-expiry

# Delete on GitHub too
git push origin --delete fix/auth-token-expiry
```

---

## 7. Writing Good Code for Open Source

### Follow the Project's Style
- Check for `.eslintrc`, `.prettierrc`, or `biome.json`
- Run the linter before committing: `npm run lint`
- Match the existing code's indentation, quotes, semicolons

### Keep Diffs Small
Long PRs (500+ lines) are hard to review and often get abandoned. Aim for:
- Under 200 lines changed per PR
- One logical change per PR

### Comment Your Code Where It's Not Obvious
```js
// Using $lt instead of $lte because the reset date is exclusive
const expiredSubs = await Subscription.find({ endDate: { $lt: new Date() } });
```

### Don't Break Existing Tests
Run `npm test` before and after your changes.

---

## 8. Writing a Great Pull Request

A good PR description answers three questions:

```markdown
## What does this PR do?
Adds a `clipScore` field (0–100) to the Clip model to store AI-generated
virality scores from the processing pipeline.

## Why is this change needed?
Fixes #42 — the frontend dashboard has no score data to display.

## How was it tested?
- Added unit tests in `tests/clip.test.js` covering score creation and update
- Tested manually with Postman against a local MongoDB instance
- All existing tests pass (`npm test`)

## Screenshots (if UI change)
[before/after screenshots here]

## Checklist
- [x] Tests added
- [x] Linter passes
- [x] No unrelated changes included
- [x] CONTRIBUTING.md guidelines followed
```

---

## 9. What Happens After You Submit

| Scenario | What To Do |
|---|---|
| No response for 1 week | Politely comment "Any update on this PR?" |
| Requested changes | Make them, push, comment "Changes addressed" |
| PR rejected | Ask why, learn from it, try again |
| PR merged | Celebrate 🎉, then start the next issue |

---

## 10. Types of Contributions (with Examples)

### 📝 Documentation (Easiest — Start Here)
- Fix typos in README
- Add missing JSDoc comments to functions
- Improve setup instructions
- Add code examples to docs

### 🐛 Bug Fixes
- Find a bug in the Issues tab
- Reproduce it locally
- Fix it, add a test for it

### ✅ Tests
- Find a file with no tests
- Write tests for existing functions
- Projects love this — tests are always needed

### ♻️ Refactoring
- Simplify complex functions
- Reduce code duplication
- Improve error handling

### ✨ New Features
- Only tackle features after doing at least 1-2 smaller contributions first
- Always discuss in the issue before writing the code

---

## 11. Common Mistakes to Avoid

| ❌ Mistake | ✅ What to Do Instead |
|---|---|
| Working directly on `main` | Always create a new branch |
| Making huge PRs | Keep PRs small and focused |
| Not running tests | Always run `npm test` before pushing |
| Fixing bugs no one asked for | Open an issue first, discuss it |
| Slow/vague PR descriptions | Be specific about what and why |
| Getting defensive about feedback | Feedback is about the code, not you |
| Disappearing after submitting | Be responsive to review comments |
| Copying someone else's code | Write your own solution |

---

## 12. Git Commands Cheatsheet

```bash
# --- Setup ---
git config --global user.name "Name"
git config --global user.email "email"

# --- Cloning & Remotes ---
git clone <url>                            # Clone a repo
git remote add upstream <original-url>    # Add original as upstream
git remote -v                             # List remotes

# --- Branching ---
git checkout -b feat/my-feature           # Create + switch branch
git checkout main                         # Switch to main
git branch -d feat/my-feature             # Delete branch locally
git push origin --delete feat/my-feature  # Delete branch on GitHub

# --- Staying Updated ---
git fetch upstream                        # Fetch upstream changes
git rebase upstream/main                  # Rebase your branch on top
git pull upstream main                    # Pull latest into main

# --- Committing ---
git status                                # See what's changed
git diff                                  # See exact changes
git add .                                 # Stage all changes
git add src/file.js                       # Stage specific file
git commit -m "type(scope): message"      # Commit with message

# --- Pushing ---
git push origin feat/my-feature           # Push to your fork
git push origin feat/my-feature --force-with-lease  # Safe force push after rebase

# --- Undoing Things ---
git restore src/file.js                   # Undo unstaged changes
git reset HEAD~1                          # Undo last commit (keep changes)
git stash                                 # Temporarily save uncommitted work
git stash pop                             # Restore stashed work
```

---

## 13. Recommended Starter Repos

### For JavaScript / Node.js Developers

| Repo | Why | Link |
|---|---|---|
| `first-contributions` | Practice the exact workflow with no risk | https://github.com/firstcontributions/first-contributions |
| `express` | You already use it | https://github.com/expressjs/express |
| `mongoose` | You already use it | https://github.com/Automattic/mongoose |
| `axios` | Very beginner friendly issues | https://github.com/axios/axios |
| `EddieHub Community` | Beginner-focused, welcoming | https://github.com/EddieHubCommunity |
| `freeCodeCamp` | Large community, lots of issues | https://github.com/freeCodeCamp/freeCodeCamp |
| `30-seconds-of-code` | Add code snippets | https://github.com/30-seconds/30-seconds-of-code |

### Find Issues Right Now
- https://goodfirstissue.dev/?language=javascript
- https://github.com/search?q=label%3A%22good+first+issue%22+language%3AJavaScript&type=issues&state=open

---

## 13a. 🌞 Google Summer of Code (GSoC) — Contributing to GSoC Orgs

**GSoC** is Google's annual program where contributors get paid to work on open source projects over 12 weeks. But even outside the program, GSoC organisations are some of the **best-maintained, most beginner-welcoming** repos to contribute to year-round.

> 🔗 Official site: https://summerofcode.withgoogle.com

### What Is GSoC?
- Google pays contributors a stipend (~$1,500–$6,600 depending on country) to work full-time on open source
- Projects run for 12 weeks during summer
- You do NOT need to wait for GSoC season to contribute — orgs accept PRs year-round
- Having prior contributions to a GSoC org **massively increases** your application chances

### GSoC Orgs Relevant to Your Stack (JS / Node / Web)

| Organisation | What They Build | GitHub | Good For |
|---|---|---|---|
| **AsyncAPI** | Spec for event-driven APIs (like OpenAPI but for async) | https://github.com/asyncapi | TypeScript, Node.js, API tooling |
| **stdlib** | Standard math/science library for JS/Node | https://github.com/stdlib-js/stdlib | Pure JS, algorithms, lots of `good first issue` |
| **webpack** | The module bundler you've used indirectly | https://github.com/webpack/webpack | JS bundling, plugins, loaders |
| **PublicLab** | Environmental civic tech platform | https://github.com/publiclab | Ruby + JS, very beginner-friendly community |
| **Sugar Labs** | Educational software for children | https://github.com/sugarlabs | Python + JS, great mentors |
| **OWASP** | Web security (Juice Shop, ZAP, etc.) | https://github.com/OWASP | Node.js, Express, security-focused |
| **MetaCall** | Polyglot runtime (call Python from Node etc.) | https://github.com/metacall/core | C++/Node interop, advanced |
| **Electron** | Desktop apps with web tech | https://github.com/electron/electron | Node.js + Chromium, large codebase |

### How to Get Into GSoC — Step by Step

#### Phase 1: Pre-Application (Start 3–4 months early)
```
1. Browse organizations at https://summerofcode.withgoogle.com/programs/2025/organizations
2. Pick 2-3 orgs whose tech stack you know
3. Clone their repo and get the project running locally
4. Join their Slack / Discord / mailing list and introduce yourself
5. Fix 1-3 small bugs or docs issues and get them merged
   → This is REQUIRED to be a competitive applicant
```

#### Phase 2: Application Period (Usually March–April)
```
6. Read the org's "Project Ideas" page (linked from the GSoC site)
7. Pick 1-2 ideas that match your skills
8. Talk to potential mentors BEFORE writing your proposal
9. Write a detailed proposal (timeline, deliverables, milestones)
10. Submit via the GSoC portal before the deadline
```

#### Phase 3: If Selected
```
11. Community bonding period — get to know mentors, plan work
12. Coding period (May–August) — build the project
13. Submit evaluations mid-term and final
14. Get paid 🎉
```

### GSoC-Specific Tips for Rahil

- **AsyncAPI** is perfect for you — you already work with REST APIs and understand JWT, auth, Express. They have Node.js tooling projects every year.
- **stdlib** has hundreds of `good first issue` math/utility functions — great for building confidence with PR workflow before GSoC.
- **PublicLab** is known for being the most welcoming community for first-timers.
- Start contributing **now** even if GSoC 2025 applications haven't opened — orgs remember contributors.

### Useful GSoC Resources
| Resource | Link |
|---|---|
| Official GSoC site | https://summerofcode.withgoogle.com |
| GSoC Organizations Explorer | https://summerofcode.withgoogle.com/programs/2025/organizations |
| GSoC student guide | https://google.github.io/gsocguides/student/ |
| gsocorganizations.dev | https://www.gsocorganizations.dev |
| Past project archive | https://summerofcode.withgoogle.com/archive |

---

## 14. Golden Rules

> 1. **Read CONTRIBUTING.md before touching any code.**
>
> 2. **Comment on the issue before starting work.** "I'd like to work on this" saves everyone time.
>
> 3. **One PR = One thing.** Don't bundle multiple fixes.
>
> 4. **Tests are not optional** in most serious projects.
>
> 5. **Small PRs get merged faster.** Big PRs get ignored.
>
> 6. **Be patient.** Maintainers are volunteers. 1-week response times are normal.
>
> 7. **Feedback is about the code, not about you.** Don't be defensive.
>
> 8. **If in doubt, ask.** A quick question in the issue saves hours of wasted work.
>
> 9. **Keep your fork synced.** Merge conflicts are painful to review.
>
> 10. **Celebrate every merge, no matter how small.** A fixed typo in docs is still a shipped contribution.

---

## 🎯 Your Action Plan — This Week

- [ ] Create a GitHub account (if you don't have one already)
- [ ] Go to https://github.com/firstcontributions/first-contributions and do the practice PR
- [ ] Install and run one project from Section 13 locally
- [ ] Find one `good first issue` and leave a comment claiming it
- [ ] Make your first real contribution

---

*Good luck Rahil — you've already built a solid backend, the open source world is ready for you. 🚀*
