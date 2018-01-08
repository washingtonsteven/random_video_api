# Random Video Api

Pulls video info for a Youtube channel's uploads from a MySQL database, automatically populating it from the Youtube API if the data isn't already in the db(, or if it's old).

## Installation

Clone the repo.

Then run `yarn install` (or `npm install`)

NB: This should also install the module [`washingtonsteven/youtube_video_list`](http://github.com/washingtonsteven/youtube_video_list) via Github vs. NPM. 

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

## Database

Currently using MySQL:

| Database: random_videos |
|-------------------------|

| Table: channels |   |
|-----------------|---|
| **channelName**:VARCHAR(255) PRIMARY | **lastScraped**:DATETIME |

| Table: videos |   |   |   |   |   |
|---------------|---|---|---|---|---|
| **title**:TEXT | **description**:TEXT | **thumbs**:TEXT | **channelTitle**:TEXT | **videoID**:VARCHAR(255) PRIMARY | **publishedAt**:DATETIME |

## Upcoming Features
1. Supply DB credentials (instead of being hardcoded)
2. Re-scrape Youtube after a certain period of time (requires update to `youtube_video_list` as well)
3. Ability to supply `YOUTUBE_API_KEY` into this function (`start`)
4. Auto-call `end()`

