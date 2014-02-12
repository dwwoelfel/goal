//Goal Model
"use strict";
var marked = require('marked');
var model;

exports.getSchema = function (Schema) {
    var schema = new Schema({
        title       : { type : String, required : true },
        description : { type : String },
        type        : { type : String, required : true },
        createDate  : { type : Date,   default  : Date.now },
        status      : { type : String },
        comments: [{
            date    : { type : Date, default : Date.now },
            content : { type : String }
        }]
    });
    schema.virtual('markedDescription').get(function(){
        return marked(this.description);
    });
    schema.set('toJSON', { virtuals: true });
    return schema;
};

exports.getModel = function (persistent) {
    if (model === undefined) {
        model = persistent.model('Goal', exports.getSchema(persistent.Schema));
    } 
    return model;
};

exports.getGoalTypes = function () {
    return [ 'Long term(10 to 20 Year)', 'Middle term(3-5 Year)', 'Annually', 'Monthly', 'Weekly'];
};

exports.getStatuses = function () {
    return ['New', 'In Progress', 'Finished', 'Postponed', 'Dropped'];
};
