# Short list of how to use Github
* Everyone needs to create an account for (i.e there are no shared accounts)

---
# The Master-Fork approach

## The "Master"
* Should be a person in charge for creating the main repository
* Should be the only person to merge pull requests
* Can be one or more persons (but not everyone) but note that this person actually has that main repository on their account so by design, not everyone could merge the pull-requests.

## Everyone
* Should fork the main repository (even the master, because that person should not work on the master-copy either)
* Should work (commit and push) on their own fork only
* Once work is done, create a pull-request towards the master repository, the master will then merge the code into the master-repository after giving their "OK" (you may merge into a new branch, test, and then merge that new branch into the master-branch)


---
# The One-Repo-Branching approach

## The "Master"
* Should create the main repository that everyone clones
* Should maybe facilitate protected branches (see below)

## Everyone
* Should clone that repository
* Should work on it by creating a new branch for their task and pushing to that, that means that everyone commits and pushes their code to separate branches on the main repository
* Everyone can merge their branches to the master-branch, but I would recommend to merge instead into a develop-branch and to protect the master-branch (https://help.github.com/articles/configuring-protected-branches/) and that only one person does the "to-master" merges
