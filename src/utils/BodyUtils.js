//公共方法:白名单过滤
function filterBody(req) {
    return {
      title: req.body.title,
      content:req.body.content
    };
}

function filterCategoryBody(req) {
    return {
        name: req.body.name,
        rank:req.body.rank
    };
}

function filterSettingBody(req) {
    return {
        name: req.body.name,
        icp: req.body.icp,
        copyright: req.body.copyright
    };
}

module.exports = {
    filterBody,
    filterCategoryBody,
    filterSettingBody
};