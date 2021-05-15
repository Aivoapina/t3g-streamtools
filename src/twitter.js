import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react';

const MainContainer = styled.div`

`;

@observer
class TwitterOverlay extends Component {
  state = {
    tweet: {}
  }

  componentDidMount() {
    const replicant = nodecg.Replicant('shownTweet');
    NodeCG.waitForReplicants(replicant).then(() => {
      replicant.on('change', value => {
        console.log(replicant.name, value);
        this.setState({ tweet: value });
      });
    });
  }

  render() {
    return (
      <MainContainer>

      </MainContainer>
    );
  }
}

const root = document.getElementById('app');
ReactDOM.render(<TwitterOverlay />, root);
