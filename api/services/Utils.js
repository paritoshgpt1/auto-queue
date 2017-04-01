module.exports = {

  checkMandatoryParams: function(mandatoryParams, allParams) {
    for(var index = 0; index < mandatoryParams.length; index++) {
      if(!_.get(allParams, mandatoryParams[index])) {
        return mandatoryParams[index];
      }
    }
    return null;
  },

};
