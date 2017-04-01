/**
* Request.js
*
* @description :: request model imported from MySql server at 1/4/2017 15:55:50.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'request',

  attributes: {
    id : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    user_id : {
      type: 'integer'
    },
    driver_id : {
      type: 'integer'
    },
    status : {
      type: 'text'
    },
    time_started : {
      type: 'datetime'
    },
    time_ended : {
      type: 'datetime'
    },
    latitude : {
      type: 'float'
    },
    longitude : {
      type: 'float'
    },
    createdAt : {
      type: 'datetime',
      columnName: 'created_at'
    },
    updatedAt : {
      type: 'datetime',
      columnName: 'updated_at'
    }
  },

  createRequest: function(input, cb) {

    var mandatoryParams = ['user_id'];
    var mandatoryParamsResponse = Utils.checkMandatoryParams(mandatoryParams, input);
    if(mandatoryParamsResponse) {
      return cb(mandatoryParamsResponse + " is missing. Mandatory params are: "+mandatoryParams);
    }

    async.waterfall([
        createRequestForUser,

      ],
      function (err, result) {
        if(!_.isEmpty(err)) return cb(err);
        return cb(null, result);
      }
    );

    function createRequestForUser(callback) {
      var requestObj = {
        user_id: input.user_id,
        status: 'waiting'
      };
      Request.create(requestObj).exec(function (err, request) {
        if(!_.isEmpty(err) || _.isEmpty(request)) return callback(err);
        return callback(null, "Request Created");
      })
    }

  },

  acceptRequest: function(input, cb) {

    var mandatoryParams = ['request_id', 'driver_id'];
    var mandatoryParamsResponse = Utils.checkMandatoryParams(mandatoryParams, input);
    if(mandatoryParamsResponse) {
      return cb(mandatoryParamsResponse + " is missing. Mandatory params are: "+mandatoryParams);
    }

    async.waterfall([
        checkExistingRequest,
        checkRequestStatus,
        acceptRequest
      ],
      function (err, result) {
        if(!_.isEmpty(err)) return cb(err);
        return cb(null, result);
      }
    );

    function checkExistingRequest(callback) {
      Request.find({driver_id: input.driver_id, status: 'ongoing'}).exec(function (err, request) {
        if(!_.isEmpty(err)) return callback(err);
        if(!_.isEmpty(request)) return callback("Please complete existing request first");
        return callback();
      })
    }

    function checkRequestStatus(callback) {
      Request.findOne({id: input.request_id}).exec(function (err, request) {
        if(!_.isEmpty(err)) return callback(err);
        if(_.isEmpty(request)) return callback("Request does not exist");
        if(request.status != 'waiting') return callback("Request no longer available");
        return callback();
      })
    }

    function acceptRequest(callback) {
      Request.update({id: input.request_id}, {
        driver_id: input.driver_id,
        status: 'ongoing',
        time_started: moment().format("YYYY-MM-DD HH:mm:ss")}
      ).exec(function (err, request) {
        if(!_.isEmpty(err) || _.isEmpty(request)) return callback(err);
        return callback(null, "Request Assigned");
      })
    }

  },

  getStatusForDriver: function(input, cb) {

    var mandatoryParams = ['driver_id'];
    var mandatoryParamsResponse = Utils.checkMandatoryParams(mandatoryParams, input);
    if(mandatoryParamsResponse) {
      return cb(mandatoryParamsResponse + " is missing. Mandatory params are: "+mandatoryParams);
    }

    async.waterfall([
        getRequests,
      ],
      function (err, result) {
        if(!_.isEmpty(err)) return cb(err);
        return cb(null, result);
      }
    );

    function getRequests(callback) {
      var requestObj = {
        or: [
          { driver_id: input.driver_id },
          { status: "waiting" }
        ]
      };
      Request.find(requestObj).exec(function (err, request) {
        if(!_.isEmpty(err)) return callback(err);
        return callback(null, request);
      })
    }

  },

  getAllRequests: function(input, cb) {

    async.waterfall([
        getAllRequests,
      ],
      function (err, result) {
        if(!_.isEmpty(err)) return cb(err);
        return cb(null, result);
      }
    );

    function getAllRequests(callback) {
      Request.find({}).exec(function (err, request) {
        if(!_.isEmpty(err)) return callback(err);
        return callback(null, request);
      })
    }

  },

  completeRequests: function(input, cb) {

    async.waterfall([
        fetchRequest,
        completeRequests
      ],
      function (err, result) {
        if(!_.isEmpty(err)) return cb(err);
        return cb(null, result);
      }
    );

    function fetchRequest(callback) {
      Request.find({
        where: {
          status: 'ongoing',
          time_started: {'<': moment().add(5,'mins').format("YYYY-MM-DD HH:mm:ss")}
        },
        select: ['id']
      }).exec(function (err, requests) {
        if(!_.isEmpty(err)) return callback(err);
        if(_.isEmpty(requests)) return callback("No request to complete");
        return callback(null, requests);
      })
    }

    function completeRequests(requests, callback) {
      Request.update({id: _.map(requests, 'id')}, {
        status: 'complete',
        time_ended: moment().format("YYYY-MM-DD HH:mm:ss")
      }).exec(function (err, response) {
        if(!_.isEmpty(err) || _.isEmpty(response)) return callback(err);
        return callback(null, _.size(requests).toString() + " Requests completed");
      })
    }

  },
};
