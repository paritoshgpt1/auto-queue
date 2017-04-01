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
    status : {
      type: 'text'
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
  }
};
