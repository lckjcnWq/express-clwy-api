/**
 * 请求成功
 * @param res
 * @param message
 * @param data
 * @param code
 */
function success(res, message, data = {}, code = 200) {
    res.status(code).json({
        status: true,
        message:message,
        data:data
    });
}

function fail(res, message, data = {}, code = 400) {
    res.status(code).json({
        status: false,
        message:message,
        data:data
    });
}

module.exports = {
    success,
    fail
}
