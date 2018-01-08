require('dotenv').config();
const mysql = require('mysql');
const { connection, query } = require('./db/db');
const youtube_video_list = require('youtube_video_list');

module.exports.start = channelName => {
  const channelQuery = mysql.format('SELECT * FROM channels WHERE channelName = ?', [channelName]);
  return query(channelQuery)
    .then(channelData => {
      if (channelData.length === 0) { // or lastScraped is too long ago
        return fetchChannelVideos(channelName, channelData); //should return same results as the database
      } else {
        return channelData;
      }
    })
    .then(channelData => {
      // get videos from db
      // return this list
      console.log("== got channel data=="); 
      console.log(channelData);
      console.log(channelData[0].channelName);
      const vidQuery = mysql.format('SELECT  * FROM videos WHERE channelTitle = ?', [channelName]);
      console.log(vidQuery);
      return query(vidQuery);
    });
}

const fetchChannelVideos = (channelName, channelData) => {
  return youtube_video_list(channelName, process.env.YOUTUBE_API_KEY)
    .then(vids => {
      const vidInsert = 'INSERT IGNORE INTO videos (title, description, thumbs, channelTitle, videoId, publishedAt) VALUES ';
      const values = vids.map(vid => mysql.format('(?, ?, ?, ?, ?, ?)', [
        vid.title,
        vid.description,
        JSON.stringify(vid.thumbs),
        vid.channelTitle,
        vid.videoId,
        vid.publishedAt
      ])).join(',');

      return query(vidInsert+values);
    })
    .then(insertResults => {
      console.log('== inserted videos ==');
      console.log(insertResults);
      
      if (channelData.length === 0) {
        // insert channel data
        return query(mysql.format('INSERT INTO channels (channelName, lastScraped) VALUES (?, NOW())', [channelName]));
      } else {
        // update channel data
        return query(mysql.format('UPDATE channels WHERE channelName = ? SET lastScraped = NOW()', [channelName]));
      }
    })
    .then(updateResults => {
      console.log('== updated channel ==');
      console.log(updateResults);

      return query(mysql.format('SELECT * FROM channels WHERE channelName = ?', [channelName]));
    });
}

module.exports.end = () => connection.end();