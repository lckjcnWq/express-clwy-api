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

function failure(res,error){
    if(error.name === 'BadRequestError'){
        return res.status(400).json({
            status: false,
            message:'请求参数错误',
            data:[error.message]
        })
    }
    if (error.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: false,
            message: '认证失败',
            data: [error.message]
        });
    }
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: false,
            message: '认证失败',
            data: ['您提交的 token 错误。']
        });
    }

    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: false,
            message: '认证失败',
            data: ['您的 token 已过期。']
        });
    }
    return res.status(400).json({
        status: false,
        message: '其它错误',
        data: [error.message]
    });
}

module.exports = {
    success,
    fail,
    failure
}
