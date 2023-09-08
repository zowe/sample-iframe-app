# Sample iframe app Changelog

All notable changes to the sample iframe app will be documented in this file.

## 1.2.1

- Small update in changelog action, it will check and update changelog when its a PR, Currently some builds show that they are failing because of the changelog, the changelog logic shouldn't run unless if its a pull request.
- Bugfix: Schema file was not included, preventing installation as a component
- Bugfix: Manifest build content template was never resolved, so it has been removed.


## 1.2.0

- Enhancement: The app now contains a manifest file so that it can be installed with `zwe components install`

## 2.8.0

- Enhancement: The app now contains examples of differences between standalone mode and simple standalone mode
