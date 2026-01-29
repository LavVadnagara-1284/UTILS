### **Step 1: Save Your Changes on `v2_beta`**
Before switching branches, you must ensure that your changes are saved to prevent losing them.

#### **Option 1: Commit Your Changes (Preferred)**
If your changes are complete and you want to keep track of them:
```sh
git add .
git commit -m "WIP: Save progress before switching branches"
```
- `git add .` → Stages all changed files.
- `git commit -m "..."` → Saves a snapshot of your work.

#### **Option 2: Stash Your Changes (If You Don't Want to Commit)**
If your changes are temporary and you don’t want to commit yet:
```sh
git stash push -m "Saving changes before switching"
```
- `git stash` → Temporarily saves changes without committing.
- `-m "..."` → Adds a message to identify the stash.

---

### **Step 2: Switch to the `develop` Branch**
Now, move to the main branch (`develop`) to pull the latest updates.

```sh
git checkout develop
```
or if using a newer Git version:
```sh
git switch develop
```
- `git checkout develop` → Moves to the `develop` branch.
- If you get an error about uncommitted changes, use `git stash` or commit them first.

---

### **Step 3: Pull the Latest Changes from Remote**
Now, get the latest updates from the remote `develop` branch.

```sh
git pull origin develop
```
- `git pull` → Fetches the latest commits and merges them into your local `develop` branch.
- `origin develop` → Specifies pulling from the `develop` branch on the remote (`origin`).

⚠ **Why?**
This ensures that your new branch will have the latest code, avoiding conflicts later.

---

### **Step 4: Create a New Branch with Your Name**
Now, create a new branch based on the updated `develop`.

```sh
git checkout -b my_name_branch
```
or
```sh
git switch -c my_name_branch
```
- `-b` or `-c` → Creates a new branch.
- `my_name_branch` → Replace with your actual name or feature name.

⚠ **Why?**
This isolates your work and keeps the `develop` branch clean.

---

### **Step 5: Bring Back Your Saved Changes**
#### **If You Committed Your Changes Earlier**
Simply merge them from `v2_beta`:
```sh
git cherry-pick v2_beta
```
This will apply the latest commit from `v2_beta` to your current branch.

#### **If You Stashed Your Changes**
Use:
```sh
git stash pop
```
or if you have multiple stashes:
```sh
git stash list
git stash apply stash@{0}  # Apply the correct stash
```
⚠ **Why?**
This restores your changes so you can continue working.

---

### **Step 6: Push Your New Branch to Remote**
Now, push your work to the remote repository.

```sh
git push origin my_name_branch
```
- `git push` → Uploads local commits to the remote repository.
- `origin my_name_branch` → Pushes your branch to `origin` for others to see.

---

### **Final Summary of Commands**
```sh
# Step 1: Save changes
git add .
git commit -m "WIP: Save progress before switching"

# Step 2: Switch to develop
git checkout develop

# Step 3: Pull latest updates
git pull origin develop

# Step 4: Create a new branch
git checkout -b my_name_branch

# Step 5: Bring back saved changes
git cherry-pick v2_beta  # If committed
# OR
git stash pop  # If stashed

# Step 6: Push your new branch
git push origin my_name_branch
```