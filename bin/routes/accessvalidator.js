let accessUrls = [
  {url: "/services/server", allowedRoles: ["admin"]},
  {url: "/services/user/all", allowedRoles: ["admin"]}
];


let listIncludes = (list1, list2) => {
  if(!list1 || !list2)return false;
  for (const element1 of list1) {
    for (const element2 of list2) {
      if (element1 === element2) {
        return true;
      }
    }
  }
  return false;
};

module.exports = (req, res, next) => {
  try {
    let user = req.user;
    let url = req.originalUrl;

    let access = accessUrls.find((item) => item.url == url);

    if (!access) {
      next();
    } else if (listIncludes(user.roles, access.allowedRoles)) {
      next();
    } else {
      res.status(403).send(`User: ${user.login} not allowed to access ${url}. Requires one of [${access.allowedRoles}]`);
    }
    return;
  } catch (e) {
    console.log(e)
  }
};
