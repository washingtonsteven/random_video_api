# Random Video Api

Pulls video info for a Youtube channel's uploads from a MySQL database, automatically populating it from the Youtube API if the data isn't already in the db(, or if it's old).

## Installation

Clone the repo.

Currently (2017-01-06), this uses [`youtube_video_list`](http://github.com/washingtonsteven/youtube_video_list) as a git submodule instead of an npm module. So you should pull that down:

```
git submodule update --recursive --remote
```

Then pull in its dependencies:

```
cd youtube_video_list
npm install // or yarn install
```

## Use

```javascript
const { start, end } = require('random_video_api');

const channelName = 'esaevian';
start(channelName)
  .then(vids => {
    console.log(vids => vids.map(v => `${v.title}`));
  });
  .catch(err => {
    console.error(err);
  })
  .finally(() => {
    end(); // must call end() in order to end the mysql connection
  })
```

## Upcoming Features
1. Re-scrape Youtube after a certain period of time (requires update to `youtube_video_list` as well)
2. Ability to supply `YOUTUBE_API_KEY` into this function (`start`)

