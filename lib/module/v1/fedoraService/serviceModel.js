const mongoose = require('mongoose');
const constants = require('../../../constant');

const Schema = mongoose.Schema;

const ServicesSchema = new Schema({
    serviceType : {
        type: Number, //1- online service , 2 door step service , 3 fedora cash 
        index: true
    },
    serviceName :{
        type: String,
        default : ''
    },
    description : {
        type: String,
        default : ''
    },
    serviceLogo :{
        type: String,
        default :''
    },
    status :{
        type: Number,  // 1-active 2 inactive
        default : 1
    },
    isDeleted: {
        type: Number,  // 0 initial , 1- soft deleted , 2 -delete
        default : 0
    },
    options : [{
        optionName : {
            type: String,
        },
        optionIcon : {
            type: String,
        },
        optionServiceType : {
            type: String,
        },
        formHeaders :{
            type: String,
        }
    }]
},{timestamps : true});


module.exports = mongoose.model(constants.DB_MODEL_REF.SERVICE, ServicesSchema);