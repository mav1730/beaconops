# 🧠 Git Commands Guide — Everything You Need to Know

Think of Git like a **time machine + save system for your code**.
Every time you "commit", you're taking a snapshot. You can always go back.
GitHub is where you upload those snapshots to the internet.

---

## 🗂️ PART 1 — Setting Up a Brand New Project on GitHub

These are the commands you run **once** when starting a project from scratch
and want to put it on GitHub.

---

### Step 1 — Initialize Git in your project folder
```bash
git init
```
**What it does:** Turns your regular folder into a "Git-tracked" folder.
It creates a hidden `.git` folder that records all your saves (commits).

> 🧒 Think of it like putting a "Save Log" book inside your project folder.
> Before this, Git has no idea your folder exists.

---

### Step 2 — Stage (select) the files you want to save
```bash
git add .
```
**What it does:** Selects ALL files in your folder and prepares them for saving.
The `.` means "everything in this folder".

```bash
git add filename.js
```
**What it does:** Stages just ONE specific file.

> 🧒 Think of `git add` like putting items in a shopping basket.
> You haven't paid yet — you're just choosing what to include.

---

### Step 3 — Check what's staged (optional but recommended)
```bash
git status
```
**What it does:** Shows you:
- Which files are **staged** (ready to commit) — shown in green
- Which files are **modified but not staged** — shown in red
- Which files are **brand new and untracked** — shown in red

> 🧒 It's like looking in your basket before paying — checking you have everything.

**Example output:**
```
Changes to be committed:
    new file:   src/server.js        ← ✅ Ready to save
    new file:   package.json         ← ✅ Ready to save

Untracked files:
    node_modules/                    ← ❌ Not staged (and we don't want it)
```

---

### Step 4 — Save a snapshot (commit)
```bash
git commit -m "feat: initial commit - BeaconOps API"
```
**What it does:** Takes a permanent snapshot of everything you staged.
The `-m` flag lets you write a message describing what you did.

> 🧒 This is like actually pressing the SAVE button in a video game.
> The message is the name of that save slot.

**Commit message conventions (professional style):**
| Prefix | When to use it |
|--------|---------------|
| `feat:` | Adding a new feature |
| `fix:` | Fixing a bug |
| `docs:` | Adding/updating documentation |
| `chore:` | Small maintenance tasks |

---

### Step 5 — Connect your project to GitHub
```bash
git remote add origin https://github.com/mav1730/beaconops.git
```
**What it does:** Tells Git *"Hey, upload my code to THIS URL on GitHub."*
`origin` is just the nickname for that URL (you can call it anything, but `origin` is standard).

> 🧒 This is like writing your GitHub address on a package so the postman knows where to deliver it.

---

### Step 6 — Rename your branch to `main`
```bash
git branch -M main
```
**What it does:** Renames your current branch from `master` (old default) to `main` (GitHub's current default).
This avoids mismatch errors when pushing.

> 🧒 GitHub calls its default branch `main`. Old Git versions call it `master`.
> This command makes sure they match.

---

### Step 7 — Push to GitHub for the first time
```bash
git push -u origin main
```
**What it does:** Uploads your commits to GitHub.
- `origin` = the GitHub URL you connected in Step 5
- `main` = the branch you're pushing
- `-u` = sets `origin main` as the default so next time you just type `git push`

> 🧒 This is the postman actually delivering your package to GitHub's servers.

---

## 🔁 PART 2 — Everyday Workflow (After Setup)

Once your repo is set up, this is the loop you repeat every time you make changes:

```
Make changes to your code
      ↓
git add .               ← Put changes in the basket
      ↓
git status              ← Double-check the basket
      ↓
git commit -m "message" ← Press Save
      ↓
git push                ← Upload to GitHub
```

---

### The short daily push (after first setup)
```bash
git add .
git commit -m "fix: corrected validation bug"
git push
```
That's it. Three commands. Every. Single. Time.

---

## 🔍 PART 3 — Useful Inspection Commands

### See your commit history
```bash
git log -n 5
```
Shows the last 5 commits with their messages, author, and date.

> 🧒 Like flipping through your save slots to see what you saved before.

---

### See what changed in your files (not yet staged)
```bash
git diff
```
Shows line-by-line what was added (green `+`) or removed (red `-`) in your files.

> 🧒 Like a "spot the difference" between your current code and the last save.

---

### Check which remote GitHub URL is connected
```bash
git remote -v
```
Shows the URL(s) your project is connected to.

**Example output:**
```
origin  https://github.com/mav1730/beaconops.git (fetch)
origin  https://github.com/mav1730/beaconops.git (push)
```

---

### See what branch you're on
```bash
git branch
```
The branch with `*` in front is your current branch.

---

## 🌿 PART 4 — Branches (Bonus: When You're More Comfortable)

A **branch** is like a parallel universe of your code. You work on a feature there,
and only merge it into `main` when it's done and tested.

```bash
git branch feature/add-auth      # Create a new branch
git checkout feature/add-auth    # Switch to it
# ... make changes ...
git add .
git commit -m "feat: add auth"
git checkout main                # Go back to main
git merge feature/add-auth       # Merge your work in
git push                         # Push to GitHub
```

> 🧒 It's like doing your homework rough work on a separate piece of paper.
> You only copy it to the final sheet (main) when it's perfect.

---

## 🚫 PART 5 — The .gitignore File (What NOT to Push)

The `.gitignore` file lists things Git should **completely ignore**.

**Our `.gitignore` contained:**
```
node_modules        ← Huge folder, reinstalled with `npm install`
.env                ← SECRET passwords, NEVER push this!
/generated/prisma   ← Auto-generated, doesn't need to be saved
```

> 🧒 It's like a "Do Not Pack" list before a trip.
> You don't pack your house keys in your suitcase — same idea.

---

## 📋 PART 6 — Quick Reference Cheat Sheet

| Command | What It Does |
|---------|-------------|
| `git init` | Start tracking a folder with Git |
| `git add .` | Stage ALL changed files |
| `git add filename` | Stage ONE specific file |
| `git status` | See what's staged / changed |
| `git commit -m "msg"` | Save a snapshot with a message |
| `git push` | Upload commits to GitHub |
| `git push -u origin main` | First-time push + sets default |
| `git pull` | Download latest changes from GitHub |
| `git log -n 5` | See last 5 commit history |
| `git diff` | See line-by-line changes |
| `git remote add origin URL` | Connect project to a GitHub repo |
| `git remote -v` | See connected GitHub URL |
| `git branch -M main` | Rename branch to main |
| `git branch` | List all branches |

---

## 🏁 PART 7 — The Exact Sequence We Used This Session

Here is every git command run during the BeaconOps session, in order:

```bash
# ── In the PARENT repo (learning-web-dev) ──────────────────────

git status
# → Saw that beaconops/ was untracked

git add beaconops/
# → Staged all BeaconOps files

git status
# → Verified what was staged

git commit -m "feat: BeaconOps API - Lead ingestion with Zod validation and Prisma/Neon DB"
# → Saved snapshot to the parent repo

git push origin main
# → Uploaded to github.com/mav1730/learning-web-dev


# ── Creating the DEDICATED repo for BeaconOps ─────────────────

git init
# → Initialized a fresh standalone Git repo inside beaconops/

git add .
# → Staged all files (node_modules and .env ignored by .gitignore)

git status
# → Verified 11 files staged, nothing sensitive included

git commit -m "feat: initial commit - BeaconOps API with Express, Prisma (Neon PostgreSQL) and Zod validation"
# → First official save of BeaconOps as its own project

git remote add origin https://github.com/mav1730/beaconops.git
# → Connected local project to the new GitHub repo

git branch -M main
# → Renamed branch from master → main

git push -u origin main
# → Pushed to github.com/mav1730/beaconops for the first time
```

---

## ✅ Next Time Checklist — Do This On Your Own

When starting a new project and pushing to GitHub:

- [ ] 1. Create the folder and write your code
- [ ] 2. Create a `.gitignore` file (add `node_modules` and `.env` at minimum)
- [ ] 3. `git init`
- [ ] 4. `git add .`
- [ ] 5. `git status` (verify nothing sensitive is staged)
- [ ] 6. `git commit -m "feat: initial commit"`
- [ ] 7. Create an empty repo on GitHub (no README, no .gitignore)
- [ ] 8. `git remote add origin YOUR_GITHUB_URL`
- [ ] 9. `git branch -M main`
- [ ] 10. `git push -u origin main`
- [ ] 11. 🎉 Done! Check GitHub to confirm it's live.

**For every change after that:**
- [ ] `git add .`
- [ ] `git commit -m "describe what you changed"`
- [ ] `git push`
