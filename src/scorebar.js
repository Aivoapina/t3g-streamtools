import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react';

import store from './store';
// import CountDown from './countdown';

/* const logos = {
  smash: require('../images/bob-omb.png'),
  magic: require('../images/magic.jpg')
} */

const TagsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  position: absolute;
  // left: 50%;
  // transform: translate(-50%, 0);
  // top: 0;
`;

const Bar = styled.div`
  position: relative;
  width: ${props => {
    if (props.showTags) {
      return props.bottom ? 'calc(100% - 20px)' : 'calc(100% - 60px)';
    }

    return '0px';
  }};
  align-self: ${props => props.right ? 'flex-start' : 'flex-end'};
  height: 50px;
  background: linear-gradient(0deg, #214f6d 5%, #337aa8 100%);
  box-shadow: ${props => props.showShadows ? '3px 3px 7px 3px #202020' : ''};
  margin-bottom: 10px;
  transform: ${props => props.right ? 'skew(-20deg)' : 'skew(20deg)'};
  transition: width ease-in-out 2s;
  * {
    transform: ${props => props.right ? 'skew(20deg)' : 'skew(-20deg)'};
    position: absolute;
  }
`;

const PlayerText = styled.span`
  font-family: 'Raleway';
  font-weight: bold;
  color: white;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  letter-spacing: 0.8px;
  font-size: 30px;
  height: 50px;
  line-height: 50px;
  opacity: ${props => props.nameOpacity};
  transition: opacity linear 1s;
`;

const Player = styled(PlayerText)`
  ${props => props.right ? 'left: 35px;' : 'right: 35px;'}
`;
const Score = styled(PlayerText)`
  ${props => props.right ? 'right: 20px;' : 'left: 20px;'}
`;

const LogoContainer = styled.div`
  background: #c6c6c6;
  box-shadow: 3px 3px 3px 3px #202020;
  z-index: 9001;
  height: 110px;
  margin-left: -20px;
  margin-right: -20px;
  opacity: ${props => props.opacity};
  display:flex;
  flex-direction: column;
  transition: opacity linear 1s;
`;

const Phase = styled.div`
  font-family: 'Raleway';
  font-size: 16px;
  line-height: 20px;
  color: black;
  text-align: center;
`;

const Logo = styled.img`
  height: 90px;
  width: 90px;
`;

const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

const LolBarContainer = styled.div`
  position: relative;
  ${props => props.pos === 'left' ? 'margin-left: 212px;' : 'margin-right: 200px;'}
`;

const LolTagsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  position: absolute;
  // left: 5px;
  // left: 50%;
  // transform: translate(-50%, 0);
  // top: 0;
`;

const LolBackground = styled.img`

`;

const LolTextContainer = styled.div`
  position: absolute;
  display: flex;
  width: calc(100% - 110px);
  justify-content: space-between;
  top: 3px;
  ${props => props.pos === 'left' ? `
    left: 52px;
  ` : `
    right: 52px;
  `}
`;

@observer
class Scorebar extends Component {
  state = {
    nameOpacity: 0,
    logoOpacity: 0,
    showCasterTags: false,
    fadeIn: true
  }

  componentDidMount() {
    this.setListeners('leftScore');
    this.setListeners('leftName');
    this.setListeners('rightScore');
    this.setListeners('rightName');
    this.setListeners('stage');
    this.setListeners('type');
    this.setListeners('bgleft');
    this.setListeners('bgright');
    setTimeout(() => this.setState({ logoOpacity: 1, showCasterTags: true }), 10);
  }

  setListeners(name) {
    const replicant = nodecg.Replicant(name);
    NodeCG.waitForReplicants(replicant).then(() => {
      replicant.on('change', value => {
        console.log(replicant.name, value);
        store.setScores(replicant.name, value);
      });
    });
  }

  handleFading = () => {
    if (this.state.fadeIn) {
      if (this.state.nameOpacity === 0) {
        this.setState({ nameOpacity: 1 });
      } else {
        // setTimeout(() => this.setState({ fadeIn: false, nameOpacity: 0 }), 10000);
      }
    } else if (this.state.showCasterTags) {
      this.setState({ showCasterTags: false });
    } else {
      this.setState({ logoOpacity: 0 });
    }
  }

  renderLolBars = () => {
    return (
      <LolTagsContainer>
        <LolBarContainer pos="left">
          <LolBackground src={store.scores.bgleft} />
          <LolTextContainer pos="left">
            <Score nameOpacity={1}>{store.scores.leftScore}</Score>
            <Player nameOpacity={1}>{store.scores.leftName}</Player>
          </LolTextContainer>
        </LolBarContainer>
        <LolBarContainer pos="right">
          <LolBackground src={store.scores.bgright}/>
          <LolTextContainer pos="right">
            <Player nameOpacity={1} right>{store.scores.rightName}</Player>
            <Score nameOpacity={1} right>{store.scores.rightScore}</Score>
          </LolTextContainer>
        </LolBarContainer>
      </LolTagsContainer>
    );
  }

  render() {
    const { logoOpacity, showCasterTags, nameOpacity, fadeIn } = this.state;
    const showShadows = fadeIn ? logoOpacity && showCasterTags : logoOpacity;

    if (store.scores.type === 'lol') {
      return this.renderLolBars();
    }

    return (
      <TagsContainer>
        <BarContainer>
          <Bar bottom showTags={showCasterTags} onTransitionEnd={this.handleFading} logoOpacity={logoOpacity} showShadows={showShadows}>
            <Score nameOpacity={nameOpacity}>{store.scores.leftScore}</Score>
            <Player nameOpacity={nameOpacity}>{store.scores.leftName}</Player>
          </Bar>
        </BarContainer>
        <LogoContainer opacity={logoOpacity} onTransitionEnd={() => fadeIn && this.setState({ showCasterTags: true })}>
          <Logo src="/assets/t3g-streamtools/logos/lantrek-2020-square.png" />
          <Phase>{store.scores.stage}</Phase>
        </LogoContainer>
        <BarContainer>
          <Bar right bottom showTags={showCasterTags} logoOpacity={logoOpacity} showShadows={showShadows}>
            <Player nameOpacity={nameOpacity} right>{store.scores.rightName}</Player>
            <Score nameOpacity={nameOpacity} right>{store.scores.rightScore}</Score>
          </Bar>
        </BarContainer>
      </TagsContainer>
    );
  }
}

const root = document.getElementById('app');
ReactDOM.render(<Scorebar />, root);
