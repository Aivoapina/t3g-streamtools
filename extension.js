const twitter = require('./extensions/twitter');

module.exports = async function (nodecg) {
  const rulesRepl = nodecg.Replicant('twitterRules', 'twitter');
  const twitterRepl = nodecg.Replicant('tweets', 'twitter');
  const newRuleRepl = nodecg.Replicant('addRule', 'twitter', { persistent: false });

  const rules = await twitter.getRules();
  rulesRepl.value = rules;

  newRuleRepl.on('change', (newData, oldData) => {
    if (newData && newData !== oldData) {
      console.log('new rule', newData);
      twitter.addRule(newData);
    }
  });

  twitter.startStream(twitterRepl);
};
