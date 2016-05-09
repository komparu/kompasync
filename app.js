var koa = require('koa');
var app = koa();

app.use(function *(){
  this.body = 'Y helo thar!';
});

app.listen(1337);