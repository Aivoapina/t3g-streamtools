import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { observer } from 'mobx-react';

const Fonts = createGlobalStyle`
  @font-face {
    font-family: 'Pink-sans';
    src: url('/assets/t3g-streamtools/fonts/Pink-Sans-100.woff') format('woff2');
    font-weight: 500;
    font-style: normal;
  }
`;

const MainContainer = styled.div`
  width: 700px;
  height: 100%;
  position: relative;
  opacity: ${props => props.hide ? 0 : 1};
  transition: opacity ease-in-out 0.5s;
`;

const BackgroundImage = styled.img`
  display: block;
  margin: auto;
  max-height: 100%;
  max-width: 100%;
  height: 100%;
`;

const TweetContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  margin: 40px 10px 10px 10px;
  width: calc(100% - 20px);
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Username = styled.span`
  font-size: 72px;
  font-family: Pink-sans;
  letter-spacing: 0.20px;
  margin-left: 25%;
`;

const Donation = styled.span`
  font-size: 72px;
  font-family: Pink-sans;
  letter-spacing: 0.20px;
  margin-right: 20px;
`;

const Tweet = styled.div`
  font-size: 32px;
  margin-left: 20px;
  margin-top: 70px;
  font-family: Pink-sans;
  letter-spacing: 0.20px;
`;

@observer
class TwitterOverlay extends Component {
  state = {
    tweet: {},
    bgUrl: '',
    hide: true,
    backgrounds: []
  }

  hideTweet = () => {
    this.setState({ hide: true });
  }

  componentDidMount() {
    const replicant = nodecg.Replicant('showTweet', 'twitter');
    const bgReplicant = nodecg.Replicant('assets:twitterbg');
    NodeCG.waitForReplicants(replicant, bgReplicant).then(() => {
      replicant.on('change', value => {
        const { tweet, backgrounds } = this.state;
        if (!tweet.data || value.data.text !== tweet.data.text) {
          const bg = backgrounds.find(b => b.name.includes(tweet.type));
          const bgUrl = bg ? bg.url : '';
          console.log('urli', bgUrl);
          this.setState({ tweet: value, hide: false, bgUrl });
          setTimeout(this.hideTweet, 20000);
        }
      });
      bgReplicant.on('change', value => {
        this.setState({ backgrounds: value, bgUrl: value[0].url });
      });
    });
  }

  render() {
    const { tweet, bgUrl, hide } = this.state;
    if (!tweet.data) {
      return null;
    }

    return (
      <MainContainer hide={hide}>
        <Fonts />
        <BackgroundImage src={bgUrl} />
        <TweetContainer>
          <Heading>
            <Username>{tweet.type === 'twitter' ? '@' : ''}{tweet.includes.users[0].username}</Username>
            {tweet.type === 'donate' && tweet.donateAmount && <Donation>{tweet.donateAmount}</Donation>}
          </Heading>
          <Tweet>{tweet.data.text}</Tweet>
        </TweetContainer>
      </MainContainer>
    );
  }
}

const root = document.getElementById('app');
ReactDOM.render(<TwitterOverlay />, root);
