### Installation

    $ npm install git+ssh://git@stash.wharton.upenn.edu:7999/ll/simpl-react.git --save

Install `bumpversion`:

    $ pip install bumpversion

### Documentation

API docs are [available online](https://lldev-team.gitlab.io/simpl-react/)

### Building

    $ npm install
    $ npm run compile --production

Commit then, to release a new version, increment the version number with:

    $ bumpversion patch

and commit the tag

### Building the documentation

    $ npm run docs
    $ open docs/index.html

