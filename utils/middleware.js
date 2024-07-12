function addUserInfo(req, res, next) {
  console.log("middleware executing");
  // console.log("Session in Middleware: ", req.session);
  if (req.session.user) {
    res.locals.userId = req.session.user.userId;
    res.locals.name = req.session.user.name;
    res.locals.isAuthenticated = !!req.session.user;
  } else {
    res.locals.userId = null;
    res.locals.name = null;
  }
  // res._render = (view, locals) => {
  //   const renderFunc = res.render
  //   res.render = () => {
  //     renderFunc(view, {
  //       ...locals,
  //       user:
  //     })
  //   }
  // }
  console.log("Locals in Middleware", res.locals._id);
  next();
}

module.exports = { addUserInfo };
