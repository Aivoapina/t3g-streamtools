const twitter = require('./extensions/twitter');

const fetchRules = async repl => {
  const rules = await twitter.getRules();
  console.log('säännöt', rules);
  repl.value = rules ? rules : [];
};

module.exports = async function (nodecg) {
  const rulesRepl = nodecg.Replicant('twitterRules', 'twitter');
  const twitterRepl = nodecg.Replicant('tweets', 'twitter');
  const newRuleRepl = nodecg.Replicant('addRule', 'twitter', { persistent: false });
  const deleteRuleRepl = nodecg.Replicant('deleteRule', 'twitter', { persistent: false });

  fetchRules(rulesRepl);

  newRuleRepl.on('change', async (newData, oldData) => {
    if (newData && newData !== oldData) {
      console.log('new rule', newData);
      const success = await twitter.addRule(newData);
      if (success) {
        fetchRules(rulesRepl);
      }
    }
  });

  deleteRuleRepl.on('change', async (newData, oldData) => {
    if (newData && newData !== oldData) {
      console.log('delete rule', newData);
      const success = await twitter.deleteRule([newData]);
      if (success) {
        console.log(rulesRepl.value);
        fetchRules(rulesRepl);
      }
    }
  });

  twitter.startStream(twitterRepl);
};
