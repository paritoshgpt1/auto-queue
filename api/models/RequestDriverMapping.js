/**
* RequestDriverMapping.js
*
* @description :: request model imported from MySql server at 1/4/2017 15:55:50.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'request_driver_mapping',

  attributes: {
    id : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    request_id : {
      type: 'integer'
    },
    driver_id : {
      type: 'integer'
    },
    distance : {
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
  }

  };
