import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react';

import store from './store';
// import gameStore from '../store';
// import { observer } from 'mobx-react';
// import t3gLogo from '../images/t3g_logo.png';
// import boblogo from '../images/boblogo.png';

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
      return props.bottom ? 'calc(100% - 10px)' : 'calc(100% - 50px)';
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

const CasterName = styled.span`
  font-family: 'Raleway';
  font-weight: bold;
  font-size: 30px;
  height: 50px;
  line-height: 50px;
  opacity: ${props => props.nameOpacity};
  transition: opacity linear 1s;
  ${props => props.right ? 'left: 35px;' : 'right: 35px;'}
`;

const CasterSocial = styled.span`
  font-family: 'Raleway';
  font-weight: bold;
  font-size: 18px;
  height: 50px;
  line-height: 50px;
  opacity: ${props => props.nameOpacity};
  transition: opacity linear 1s;
  ${props => props.right ? 'left: 35px;' : 'right: 35px;'}
`;

const LogoContainer = styled.div`
  background: #c6c6c6;
  box-shadow: 3px 3px 3px 3px #202020;
  z-index: 9001;
  height: 110px;
  margin-left: -20px;
  margin-right: -20px;
  opacity: ${props => props.opacity};
  transition: opacity linear 1s;
`;

const Logo = styled.img`
  height: 100%;
`;

const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

@observer
class CasterTags extends Component {
  state = {
    nameOpacity: 0,
    logoOpacity: 0,
    showCasterTags: false,
    fadeIn: true
  }

  setListeners(name) {
    const replicant = nodecg.Replicant(name);
    NodeCG.waitForReplicants(replicant).then(() => {
      replicant.on('change', value => {
        console.log(replicant.name, value);
        store.setCasters(replicant.name, value);
      });
    });
  }

  componentDidMount() {
    this.setListeners('leftCaster');
    this.setListeners('leftSocial');
    this.setListeners('rightCaster');
    this.setListeners('rightSocial');
    this.setListeners('logo');
    setTimeout(() => this.setState({ logoOpacity: 1 }), 10);
  }

  handleFading = () => {
    if (this.state.fadeIn) {
      if (this.state.nameOpacity === 0) {
        this.setState({ nameOpacity: 1 });
      } else {
        setTimeout(() => this.setState({ fadeIn: false, nameOpacity: 0 }), 10000);
      }
    } else if (this.state.showCasterTags) {
      this.setState({ showCasterTags: false });
    } else {
      this.setState({ logoOpacity: 0 });
    }
  }

  render() {
    const { logoOpacity, showCasterTags, nameOpacity, fadeIn } = this.state;
    const showShadows = fadeIn ? logoOpacity && showCasterTags : logoOpacity;

    return (
      <TagsContainer>
        <BarContainer>
          <Bar bottom showTags={showCasterTags} onTransitionEnd={this.handleFading} logoOpacity={logoOpacity} showShadows={showShadows}>
            <CasterName nameOpacity={nameOpacity}>{store.casters.leftCaster}</CasterName>
          </Bar>
          <Bar bottom={false} showTags={showCasterTags} logoOpacity={logoOpacity} showShadows={showShadows}>
            <CasterSocial nameOpacity={nameOpacity}>{store.casters.leftSocial}</CasterSocial>
          </Bar>
        </BarContainer>
        <LogoContainer opacity={logoOpacity} onTransitionEnd={() => fadeIn && this.setState({ showCasterTags: true })}>
          <Logo src={store.casters.logo} />
        </LogoContainer>
        <BarContainer>
          <Bar right bottom showTags={showCasterTags} logoOpacity={logoOpacity} showShadows={showShadows}>
            <CasterName nameOpacity={nameOpacity} right>{store.casters.rightCaster}</CasterName>
          </Bar>
          <Bar right showTags={showCasterTags} logoOpacity={logoOpacity} showShadows={showShadows}>
            <CasterSocial nameOpacity={nameOpacity} right>{store.casters.rightSocial}</CasterSocial>
          </Bar>
        </BarContainer>
      </TagsContainer>
    );
  }
}

const root = document.getElementById('app');
ReactDOM.render(<CasterTags />, root);
