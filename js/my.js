//微信登录
var wxObj = null;
function wxlogin(){
	mui('#sheet1').popover('toggle');
	plus.oauth.getServices(function(services){
		//console.log(JSON.stringify(services));
		
		for (var k in services) {
			if (services[k].id == 'weixin') {
				wxObj = services[k];
			}
		}
		//console.log(JSON.stringify(wxObj));
		if (wxObj == null) {mui.toast('未获取到微信登录服务或者未安装微信');}
		
		wxObj.login(function(res){
			console.log(JSON.stringify(res));
			console.log(JSON.stringify(wxObj));
			//res比wxObj多了一个开头的target
		//获取微信唯一id  unionid  头像 昵称
			var unionid = wxObj.authResult.unionid;
			var uface    = wxObj.userInfo.headimgurl;
			var uname   = wxObj.userInfo.nickname;
			
			mui.post('http://hoa.hcoder.net/index.php?c=members&m=addByWx',{
					openid : unionid,
					nickname : uname
				},function(data){
					//console.log(JSON.stringify(data));
					var uid   = data.id;
					var urand = data.randmumber;
					
				//进行本地存储  ----- uid+""--> 变成string
					plus.storage.setItem("uid",uid+"");
					plus.storage.setItem("urand",urand+"");
					plus.storage.setItem("uname",uname);
					plus.storage.setItem("uface",uface);
					
					mui.toast('登录成功');
				}
			);
			
		},function(e){
			mui.toast('获取微信登录认证服务失败'+"---"+e.message+"---"+e.code);
		})
	},function(e){
		mui.toast('获取登录认证服务列表失败'+"---"+e.message+"---"+e.code);
	});
}

//QQ登录
var qqObj = null;
function qqlogin(){
	mui('#sheet1').popover('toggle');
	plus.oauth.getServices(function(services){
		//先获得QQ登录的对象
		for (var k in services) {
			if (services[k].id == 'qq') {
				qqObj = services[k];
			}
		}
		if (qqObj == null) {mui.toast('未获取到QQ登录服务或者未安装QQ');}
		
		//用QQ登陆对象调用登录方法
		qqObj.login(function(res){
			console.log(JSON.stringify(qqObj));
			console.log(JSON.stringify(res));
			
			var unionid = qqObj.authResult.access_token;
			var uface   = qqObj.userInfo.headimgurl;
			var uname   = qqObj.userInfo.nickname;
			
			mui.post('http://hoa.hcoder.net/index.php?c=members&m=addByWx',{
					openid : unionid,
					nickname : uname
				},function(data){
					//console.log(JSON.stringify(data));
					var uid   = data.id;
					//var urand = data.randmumber;
					
				//进行本地存储  ----- uid+""--> 变成string
					plus.storage.setItem("uid",uid+"");
					//plus.storage.setItem("urand",urand+"");
					plus.storage.setItem("uname",uname);
					plus.storage.setItem("uface",uface);
					
					mui.toast('登录成功');
				}
			);
			
		},function(e){
			mui.toast('获取QQ登录认证服务失败'+"---"+e.message+"---"+e.code);
		})
		
		
	},function(e){
		mui.toast('获取登录认证服务列表失败'+"---"+e.message+"---"+e.code);
	})
}

//退出方法
function logOut(){
		plus.oauth.getServices(function(services){
			for (var k in services) {
				if (services[k].id == 'weixin') {
					wxObj = services[k];
				}
				if (services[k].id == 'qq') {
					qqObj = services[k];
				}
			}
			//console.log(JSON.stringify(wxObj));
			//if (wxObj == null) {mui.toast('未获取到微信登录服务或者未安装微信');}
			
			wxObj.logout(function(){
				plus.storage.removeItem('uid');
				plus.storage.removeItem('uname');
				plus.storage.removeItem('uface');
				plus.storage.removeItem('urand');
				
				mui.toast('退出成功');
				plus.webview.close(plus.webview.currentWebview());
			},function(e){
				mui.toast(e.message+"--"+e.code);
			});
			qqObj.logout(function(){
				plus.storage.removeItem('uid');
				plus.storage.removeItem('uname');
				plus.storage.removeItem('uface');
				//plus.storage.removeItem('urand');
				
				mui.toast('退出成功');
				
				_index = plus.webview.getLaunchWebview();
				_index.evalJS('changeSub(0);h("#navFooter").find("a").removeClass("mui-active");h("#sub1").addClass("mui-active");');
				
			},function(e){
				mui.toast(e.message+"--"+e.code);
			});
		
		
		},function(e){
			mui.toast('获取登录认证服务列表失败'+"---"+e.message+"---"+e.code);
		});
}