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
  // height: 100%;
  position: relative;
  opacity: ${props => props.hide ? 0 : 1};
  transition: opacity ease-in-out 0.5s;
`;

const BackgroundImage = styled.img`
  display: block;
  margin: auto;
  max-height: 100%;
  max-width: 100%;
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
  color: #00c9a8;
  -webkit-text-stroke: 2px black;
`;

const Donation = styled.span`
  font-size: 72px;
  font-family: Pink-sans;
  letter-spacing: 0.20px;
  margin-right: 20px;
  color: #00C9A8;
  -webkit-text-stroke: 2px black;
`;

const Tweet = styled.div`
  font-size: 32px;
  margin-left: 20px;
  margin-top: 70px;
  font-family: Pink-sans;
  letter-spacing: 0.20px;
  color: #00C9A8;
  -webkit-text-stroke: 1px black;

`;

@observer
class TwitterOverlay extends Component {
  state = {
    tweet: {},
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
        const { tweet } = this.state;
        if (!tweet.data || value.data.text !== tweet.data.text) {
          this.setState({ tweet: value, hide: false });
          setTimeout(this.hideTweet, 30000);
        }
      });
      bgReplicant.on('change', value => {
        const data = {
          twitter: value.find(b => b.name.includes('twitter')).url,
          donate: value.find(b => b.name.includes('donate')).url
        };
        this.setState({ backgrounds: data });
      });
    });
  }

  render() {
    const { tweet, backgrounds, hide } = this.state;

    if (!tweet.data || !backgrounds.donate) {
      return null;
    }

    return (
      <MainContainer hide={hide}>
        <Fonts />
        <BackgroundImage src={backgrounds[tweet.type]} />
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
