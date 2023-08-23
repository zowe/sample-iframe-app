# Sample iframe app Changelog

All notable changes to the sample iframe app will be documented in this file.

## 1.2.1
- This action making a CHANGELOG note via special syntax from the GitHub PR commit message, like it could automatically update CHANGELOG.md with the message. First job checks if PR body has changelog note or not if it's not there then it asked them to add it and second job is to check if changelog note has been added in changelog.md file or not. (#37)

- Bugfix: Schema file was not included, preventing installation as a component
- Bugfix: Manifest build content template was never resolved, so it has been removed.


## 1.2.0

- Enhancement: The app now contains a manifest file so that it can be installed with `zwe components install`

## 2.8.0

- Enhancement: The app now contains examples of differences between standalone mode and simple standalone mode
