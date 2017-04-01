/**
* Request.js
*
* @description :: request controller imported from MySql server at 1/4/2017 15:55:50.
* @docs        :: http://sailsjs.org/#!documentation/controllers
*/


module.exports = {

  createRequest: function (req, res) {
    Request.createRequest(req.params.all(), function(err, result){
      if(!_.isNull(err)) return res.badRequest(err);
      return res.ok(result);
    });
  },

  acceptRequest: function (req, res) {
    Request.acceptRequest(req.params.all(), function(err, result){
      if(!_.isNull(err)) return res.badRequest(err);
      return res.ok(result);
    });
  },

  getStatusForDriver: function (req, res) {
    Request.getStatusForDriver(req.params.all(), function(err, result){
      if(!_.isNull(err)) return res.badRequest(err);
      return res.ok(result);
    });
  },

};
