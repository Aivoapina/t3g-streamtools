import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react';

const MainContainer = styled.div`
  height: 540px;
  width: 960px;
  background: url(${props => props.bgUrl});
  background-position: contain;
  background-size: contain;
  background-repeat: no-repeat;
`;

const TweetContainer = styled.div`
  position: absolute;
  top: 110px;
  left: 325px;
  width: 500px;
`;

const Username = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Tweet = styled.div`
  font-size: 20px;
`;

@observer
class TwitterOverlay extends Component {
  state = {
    tweet: {},
    bgUrl: ''
  }

  componentDidMount() {
    const replicant = nodecg.Replicant('showTweet', 'twitter');
    const bgReplicant = nodecg.Replicant('assets:twitterbg');
    NodeCG.waitForReplicants(replicant, bgReplicant).then(() => {
      replicant.on('change', value => {
        console.log(replicant.name, value);
        this.setState({ tweet: value });
      });
      bgReplicant.on('change', value => {
        console.log('kuvat', value[0]);
        this.setState({ bgUrl: value[0].url });
      });
    });
  }

  render() {
    const { tweet, bgUrl } = this.state;
    console.log('piirto', tweet);
    if (!tweet.data) {
      return null;
    }

    return (
      <MainContainer bgUrl={bgUrl}>
        <TweetContainer>
          <Username>{tweet.includes.users[0].username}</Username>
          <Tweet>{tweet.data.text}</Tweet>
        </TweetContainer>
      </MainContainer>
    );
  }
}

const root = document.getElementById('app');
ReactDOM.render(<TwitterOverlay />, root);
