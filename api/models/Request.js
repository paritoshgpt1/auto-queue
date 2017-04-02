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
    x : {
      type: 'integer'
    },
    y : {
      type: 'integer'
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

    var mandatoryParams = ['user_id','x','y'];
    var mandatoryParamsResponse = Utils.checkMandatoryParams(mandatoryParams, input);
    if(mandatoryParamsResponse) {
      return cb(mandatoryParamsResponse + " is missing. Mandatory params are: "+mandatoryParams);
    }

    async.waterfall([
        sanitationChecks,
        createRequestForUser,
        findClosestDriver,
        createMappings
      ],
      function (err, result) {
        if(!_.isEmpty(err)) return cb(err);
        return cb(null, result);
      }
    );

    function sanitationChecks(callback) {
      Request.find({status: 'waiting'}).exec(function (err, requests) {
        if(!_.isEmpty(err)) return callback(err);
        if(_.size(requests) >= sails.config.params.rideThreshold) {
          return callback("Rides not available. Try again later");
        }
        return callback();
      })
    }

    function createRequestForUser(callback) {
      var requestObj = {
        user_id: input.user_id,
        status: 'waiting',
        x: input.x,
        y: input.y
      };
      Request.create(requestObj).exec(function (err, request) {
        if(!_.isEmpty(err) || _.isEmpty(request)) return callback(err);
        return callback(null, request);
      })
    }

    function findClosestDriver(request, callback) {
      var driverPositions = sails.config.params['driverPositions'];
      var requestMapping= [];
      for(var driver_id in driverPositions){
        var position = driverPositions[driver_id];
        var distance = Utils.findDistance(input.x, input.y, position.x, position.y);
        var requestMappingObj = {
          request_id: request.id,
          driver_id: driver_id,
          distance: distance
        };
        requestMapping.push(requestMappingObj);
      }
      var sortedDrivers = _.sortBy(requestMapping, 'distance');
      var filteredDrivers = _.take(sortedDrivers,sails.config.params.noOfClosestDrivers);
      return callback(null, filteredDrivers);
    }

    function createMappings(filteredDrivers, callback) {
      RequestDriverMapping.create(filteredDrivers).exec(function (err, mappings) {
        for(var index=0; index<mappings.length; index++) {
          var driver_id = mappings[index].driver_id;
          sails.io.sockets.emit('request'+driver_id, {task: 'refresh'});
        }
        if(!_.isEmpty(err) || _.isEmpty(mappings)) return callback(err);
        return callback(null, mappings);
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
        sanitationChecks,
        getRequests,
        formatResponse
      ],
      function (err, result) {
        if(!_.isEmpty(err)) return cb(err);
        return cb(null, result);
      }
    );

    function sanitationChecks(callback) {
      if(input.driver_id > sails.config.params.noOfDrivers) return callback("Driver does not exist");
      return callback();
    }

    function getRequests(callback) {
      var requestQuery = "select distinct r.id, r.user_id, r.driver_id, r.status, r.time_started, r.time_ended, r.x, r.y, \
        r.created_at, r.updated_at \
        from `request` r \
        left outer join `request_driver_mapping` rdm \
        on r.id = rdm.request_id \
        where (r.status = 'waiting' and rdm.driver_id = "+input.driver_id+") " +
        "or (r.driver_id = "+input.driver_id+")";
      Request.query(requestQuery, function (err, request) {
        if(!_.isEmpty(err)) return callback(err);
        return callback(null, request);
      })
    }

    function formatResponse(requests, callback) {
      var formattedRequests = _.groupBy(requests, 'status');
      return callback(null, formattedRequests);
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
          time_started: {'<': moment().add(sails.config.params.timeToCompleteARide,'m').format("YYYY-MM-DD HH:mm:ss")}
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
        for(var index=0; index<response.length; index++) {
          var driver_id = response[index].driver_id;
          sails.io.sockets.emit('request'+driver_id, {task: 'refresh'});
        }
        if(!_.isEmpty(err) || _.isEmpty(response)) return callback(err);
        return callback(null, _.size(requests).toString() + " Requests completed");
      })
    }

  },
};
