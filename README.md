# Simpl React

[![Build Status](https://travis-ci.com/simplworld/simpl-react.svg?token=cyqpBgqLC1o8qUptfcpE&branch=7-enable-CI)](https://travis-ci.com/simplworld/simpl-react)

### Installation

    $ npm install git+ssh://git@github.com:simplworld/ll/simpl-react.git --save

### Development

    $ npm install
    $ npm test

### Build lib

    $ npm run compile --production

### Build docs

    $ npm run docs
    $ open docs/index.html

Commit then, to release a new version, increment the version number with:

    $ pip install bumpversion
    $ bumpversion patch

Then push to the repo:

    $ git push && git push --tags

### Documentation

API docs are [available online](https://lldev-team.gitlab.io/simpl-react/)




