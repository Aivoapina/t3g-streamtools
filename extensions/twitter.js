const needle = require('needle');
const env = require('../env');

const headers = {
  Authorization: `Bearer ${env.twitterBearerToken}`,
  'Content-Type': 'application/json'
};

const RULES_URL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const STREAM_URL = 'https://api.twitter.com/2/tweets/search/stream?expansions=author_id&user.fields=id,name,username&tweet.fields=text';

const deleteRule = async ids => {
  const rules = {
    delete: {
      ids
    }
  };
  return postRule(rules);
};

const addRule = async keyword => {
  const rules = {
    add: [
      { value: keyword + ' -is:retweet' }
    ]
  };
  return postRule(rules);
};

const postRule = async rules => {
  const res = await needle('post', RULES_URL, JSON.stringify(rules), { headers });
  if (res.statusCode === 201) {
    return true;
  }

  return false;
};

const getRules = async () => {
  const res = await needle('get', RULES_URL, { headers });
  return res.body.data;
};

const startStream = async repl => {
  const stream = needle.get(STREAM_URL, { headers, timeout: 20000, parse: true });
  stream.on('data', data => {
    try {
      const json = JSON.parse(data);
      repl.value = json;
    } catch (err) {
      if (data.status === 401) {
        console.log('Invalid token', err);
      }

      console.log(data.detail);
    }
  });
  
  return stream;
};

module.exports = { addRule, getRules, startStream, deleteRule };
