const mongoose = require('mongoose');
const constants = require('../../../constant');

const Schema = mongoose.Schema;

const GrievanceSchema = new Schema({
   
    customerName :{
        type: String,
        default : ''
    },
    description : {
        type: String,
        default : ''
    },
    status :{
        type: Number,  // status 1-pending ,2 - watched , 3 - actionTaken
        default : 1
    },
    customerEmail :{
        type: String, 
    },
    customerMobile : String,
    isDeleted: {
        type: Number,  // 0 initial , 1- soft deleted , 2 -delete
        default : 0
    }
},{timestamps : true});


module.exports = mongoose.model(constants.DB_MODEL_REF.GRIEVANCE, GrievanceSchema);