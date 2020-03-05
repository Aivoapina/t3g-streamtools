import { observable, action } from 'mobx';

class Store {
  @observable casters = {
    leftCaster: '',
    leftSocial: '',
    rightCaster: '',
    rightSocial: ''
  }

  @observable scores = {
    leftScore: '',
    leftName: '',
    rightScore: '',
    rightName: '',
    stage: '',
    type: 'lol'
  }

  @action setCasters = (key, value) => {
	  this.casters[key] = value;
  }

  @action setScores = (key, value) => {
    this.scores[key] = value;
  }

}

export default new Store();
