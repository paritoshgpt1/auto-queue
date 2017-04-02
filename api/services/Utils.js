module.exports = {

  checkMandatoryParams: function(mandatoryParams, allParams) {
    for(var index = 0; index < mandatoryParams.length; index++) {
      if(!_.has(allParams, mandatoryParams[index])) {
        return mandatoryParams[index];
      }
    }
    return null;
  },

  findDistance: function (x1,y1,x2,y2) {
    var dist = Math.sqrt(Math.pow((x1-x1), 2) + Math.pow((y2-y1), 2));
    return dist;
  }

};
