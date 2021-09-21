exports.success = (res, result, message = "success") => {
    res.status(200).json({
        error: false,
        message: message,
        data: result,
    });
};

exports.error = (res, message = "Unable to process request", result = null, err, errorCode = 400) => {
    res.status(errorCode).json({
        error: true,
        message: message,
        data: result,
        errors: err,
    });
};
