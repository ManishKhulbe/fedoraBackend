const constant = require("../../../constant");
const {isDateYYYYMMDD} = require("../../../appUtils");
const exceptions = require("../../../customException");




const validateTransaction = function (req, res, next) {
    let {filterBy, filterValue, isDownload, startDate, endDate} = req.query;
    const errors = [];

    if (startDate && !endDate){
        errors.push({
            fieldName: "endDate", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "endDate")
        });
    }

    if (startDate && !isDateYYYYMMDD(startDate)){
        errors.push({
            fieldName: "filterBy", message: "invalid start date "
        });
    }

    if (endDate && !isDateYYYYMMDD(endDate)){
        errors.push({
            fieldName: "filterBy", message: "invalid start date "
        });
    }
    if (filterBy && (filterBy !== 'month' && filterBy !== 'year')) {
        errors.push({
            fieldName: "filterBy", message: "invalid filter by value"
        });
    }

    if (filterBy && !filterValue){
        errors.push({
            fieldName: "filterValue", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "filterValue")
        });
    }

    if (filterValue && !isDateYYYYMMDD(filterValue)){
        errors.push({
            fieldName: "filterBy", message: "invalid filter date"
        });
    }
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
}

const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(constant.MESSAGES.validationError, errors))
    }
    next();
};
module.exports = {
    validateTransaction
};