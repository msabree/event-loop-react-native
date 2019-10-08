# Event Loop

This will help you get the mobile app up and running on iOS and Android. There are a few prerequisites to get started.

### Prerequisites:

Install [NodeJS](https://nodejs.org/en/download/)

Install [React Native CLI & dependecies](https://facebook.github.io/react-native/docs/getting-started)

>To contribute to this project your need to first fork (not clone) the repo

>Once forked you will clone YOUR forked repo

> Keeping fork in sync with upstream [See Here](https://stackoverflow.com/questions/7244321/how-do-i-update-a-github-forked-repository)

> Reset fork back to state of upstream [See Here](https://stackoverflow.com/questions/42332769/how-do-i-reset-the-git-master-branch-to-the-upstream-branch-in-a-forked-reposito)

##### Getting the app runing on iOS

```sh
$ sudo gem install cocoapods
$ cd <cloned-repo-name>
$ npm i
$ cd ios/
$ pod install
```

Open XCode (YOU MUST OPEN THE WORKSPACE FILE IN THE IOS DIRECTORY)

Click the run button. If you get an error try setting your build system to use 
legacy settings. A successful build will open an iOS simulator.

##### Getting the app runing on Android

```sh
$ cd <cloned-repo-name>
$ npm i
$ react-native run-android
```

You must have a device conneced via USB or an AVD set up in Android Studio