### Installation

    $ npm install git+ssh://git@stash.wharton.upenn.edu:7999/ll/simpl-react.git --save

### Development

    $ npm install
    $ npm test


### Building lib

    $ npm install
    $ npm run compile --production

Commit then, to release a new version, increment the version number with:

    $ pip install bumpversion
    $ bumpversion patch

Then push to the repo:

    $ git push && git push --tags

### Documentation

API docs are [available online](https://lldev-team.gitlab.io/simpl-react/)


### Building docs

    $ npm run docs
    $ open docs/index.html


