//公共方法:白名单过滤
function filterBody(req) {
    return {
      title: req.body.title,
      content:req.body.content
    };
}
module.exports = {
    filterBody
};