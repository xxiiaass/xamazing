var log4js = require('log4js');

log4js.configure({
  appenders: [
    { type: 'console' }, //控制台输出
    {
      type: 'file', //文件输出
      filename: 'logs/access.log', 
      maxLogSize: 4096,
      backups:3,
      category: 'normal' 
    }
  ],
  replaceConsole: true
});

exports.logger=function(name){
  var logger = log4js.getLogger(name);
  logger.setLevel('DEBUG');
  return logger;
}