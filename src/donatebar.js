import React from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';

const Fonts = createGlobalStyle`
  @font-face {
    font-family: 'Pink-sans';
    src: url('/assets/t3g-streamtools/fonts/Pink-Sans-100.woff') format('woff2');
    font-weight: 500;
    font-style: normal;
  }
  body {
    margin: 0;
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 50px;
  // border: grey solid 1px;
  position: relative;
  background-color: #383838;
`;

const ProgressBar = styled.div`
  width: ${props => props.width * 100}%;
  background-color: #00C9A8;
  height: 100%;
`;

const Raised = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  line-height: 50px;
  font-family: Pink-sans;
  font-size: 40px;
  transform: translateX(-50%);
  color: white;
  -webkit-text-stroke: 1px black;
`;

const GoalSpan = styled.span`
  font-family: Pink-sans;
  font-size: 26px;
  color: white;
  margin-left: 10px;
`;

const DonoBarContainer = styled.div`
  background-color: black;
`;

export default class Gdd extends React.Component {
  state = {
    donates: [],
    donateAmount: {},
    donateGoal: 0,
  }

  url = '';

  initReplicants = () => {
    const donateRepl = nodecg.Replicant('donateGoal');
    const urlRepl = nodecg.Replicant('donateUrl');
    NodeCG.waitForReplicants(donateRepl, urlRepl).then(() => {
      donateRepl.on('change', value => {
        this.setState({ donateGoal: value });
      });
      urlRepl.on('change', url => {
        this.url = url;
        this.getDonateAmount();
      });
    });
  }

  async componentDidMount() {
    this.initReplicants();
    this.donateAmountPoller = setInterval(this.getDonateAmount, 10000);
  }

  getDonateAmount = async () => {
    const res = await fetch(this.url);
    const donateAmount = await res.json();
    this.setState({ donateAmount });
  }

  render() {
    const { donateAmount, donateGoal } = this.state;
    const donatePercent = donateAmount.raisedAmount / donateGoal;
    const width = isNaN(donatePercent) ? 0 : donatePercent;
    return (
      <DonoBarContainer>
        <Fonts />
        <ProgressBarContainer>
          <ProgressBar width={width}>
          </ProgressBar>
          <Raised>{donateAmount.raisedAmount}€</Raised>
        </ProgressBarContainer>
        <GoalSpan>Goal: {donateGoal}€</GoalSpan>
      </DonoBarContainer>
    );
  }
}

const root = document.getElementById('app');
ReactDOM.render(<Gdd />, root);
