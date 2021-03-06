module.exports = class SessionHandler {

  constructor(options){
    this.options = options; // none expected yet
    let S = require('./session.class.js');
    this.Session = new S().myModel;
    return (...args) => this.middleware(...args);
  }

  middleware(req, res, next){
    if(!req.cookies.session){
      // set a cookie for a session if it doesn't exist
      req.session = new this.Session();
      // see https://expressjs.com/en/4x/api.html#res.cookie
      res.cookie('session', req.session._id, {
        path: '/',
        httpOnly: true
      });
      req.session.save(next);
    }
    else {
      // Retrieve a session from a session cookie value
      this.Session.findOne({_id:req.cookies.session}, (err, session)=>{
        req.session = session;
        req.session.data = req.session.data || {};
        next();
      });
    }
  }

}