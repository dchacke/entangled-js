var Entangled=function(){function e(e,t,o,r){for(var i in e)e.hasOwnProperty(i)&&(this[i]=e[i]);this.socket=t,this.webSocketUrl=function(){if(r){var e=":"+r+"Id",t=this[r+"Id"],s=this.socket.replace(e,t);return s}return this.socket},o&&(this[o]=function(){return new s(this.webSocketUrl()+"/"+this.id+"/"+o)}),r&&(this[r]=function(e){var t=this.webSocketUrl().split("/"),o=t.slice(t.length-6,4).join("/"),i=new s(o),n=this[r+"Id"];i.find(n,function(t){e(t)})}.bind(this))}function t(t,s,o){this.all=[];for(var r=0;r<t.length;r++){var i=new e(t[r],s,o);this.all.push(i)}}function s(e){this.webSocketUrl=e}return e.prototype.$save=function(e){if(this.id){var t=new WebSocket(this.webSocketUrl()+"/"+this.id+"/update");t.onopen=function(){t.send(this.asSnakeJSON())}.bind(this),t.onmessage=function(t){if(t.data){var o=JSON.parse(t.data);if(o.resource)for(key in o.resource)this[key]=o.resource[key]}this[this.hasMany]=new s(this.webSocketUrl()+"/"+this.id+"/"+this.hasMany),e&&e(this)}.bind(this)}else{var t=new WebSocket(this.webSocketUrl()+"/create");t.onopen=function(){t.send(this.asSnakeJSON())}.bind(this),t.onmessage=function(t){if(t.data){var s=JSON.parse(t.data);if(s.resource)for(key in s.resource)this[key]=s.resource[key]}e&&e(this)}.bind(this)}},e.prototype.$update=function(e,t){for(var s in e)e.hasOwnProperty(s)&&(this[s]=e[s]);this.$save(t)},e.prototype.$destroy=function(e){var t=new WebSocket(this.webSocketUrl()+"/"+this.id+"/destroy");t.onopen=function(){t.send(null)},t.onmessage=function(t){if(t.data){var s=JSON.parse(t.data);if(s.resource)for(key in s.resource)this[key]=s.resource[key];this.destroyed=!0,Object.freeze(this)}e&&e(this)}.bind(this)},e.prototype.$valid=function(){return!(this.errors&&Object.keys(this.errors).length)},e.prototype.$invalid=function(){return!this.$valid()},e.prototype.$persisted=function(){return!(this.$newRecord()||this.$destroyed())},e.prototype.$newRecord=function(){return!this.id},e.prototype.$destroyed=function(){return!!this.destroyed},e.prototype.asSnakeJSON=function(){var e,t=this,s={};return Object.keys(this).forEach(function(o){t.hasOwnProperty(o)&&(e=o.match(/[A-Za-z][a-z]*/g).map(function(e){return e.toLowerCase()}).join("_"),s[e]=t[o])}),JSON.stringify(s)},s.prototype.hasMany=function(e){this.hasMany=e},s.prototype.belongsTo=function(e){this.belongsTo=e},s.prototype["new"]=function(t){return new e(t,this.webSocketUrl,this.hasMany,this.belongsTo)},s.prototype.all=function(s){var o=new WebSocket(this.webSocketUrl);o.onmessage=function(r){if(r.data.length){var i=JSON.parse(r.data);if(i.resources)this.resources=new t(i.resources,o.url,this.hasMany);else if(i.action)if("create"===i.action)this.resources.all.push(new e(i.resource,o.url,this.hasMany));else if("update"===i.action){for(var n,a=0;a<this.resources.all.length;a++)this.resources.all[a].id===i.resource.id&&(n=a);this.resources.all[n]=new e(i.resource,o.url,this.hasMany)}else if("destroy"===i.action){for(var n,a=0;a<this.resources.all.length;a++)this.resources.all[a].id===i.resource.id&&(n=a);this.resources.all.splice(n,1)}else console.log("Something else other than CRUD happened..."),console.log(i)}s(this.resources.all)}.bind(this)},s.prototype.create=function(e,t){var s=this["new"](e);s.$save(t)},s.prototype.find=function(t,s){var o=this.webSocketUrl,r=new WebSocket(o+"/"+t);r.onmessage=function(t){if(t.data.length){var r=JSON.parse(t.data);r.resource&&!r.action?this.resource=new e(r.resource,o,this.hasMany):r.action?"update"===r.action?this.resource=new e(r.resource,o,this.hasMany):"destroy"===r.action&&(this.resource=void 0):(console.log("Something else other than CRUD happened..."),console.log(r))}s(this.resource)}.bind(this)},s}();
