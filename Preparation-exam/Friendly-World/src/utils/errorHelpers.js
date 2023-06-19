const { MongooseError, Error } = require('mongoose');

exports.extractErrorMessages = (error) => {

    if (error instanceof MongooseError) {
        return Object.values(error.errors).map(x => x.message);
    } else if (error) {
        return [error.message];
    }

}



exports.errorHandler = (error) => {
    const result = {
        message: [],
        fields: {},
    };

    if (error.name === 'ValidationError') {
        Object.entries(error.errors).map(([ err]) => {
            result.message.push(err.message);
            result.fields[field] = field;
        });
    } else if (Array.isArray(error)) {
        error.map(elem => {
            result.message.push(elem.msg);
            result.fields[elem.param] = elem.value;
        });
    } else {
        result.message.push(error.message);
    }
      
    return result;
}