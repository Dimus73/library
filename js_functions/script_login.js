// Где-то в глобальной переменной нужно хронить токен пользователя - Это его идентификатор
let userTOKEN=''

// *****************
async function requestPOST(url, dataObj){
	let requestData={
		method:'POST',
		headers:{
			"Content-Type": "application/json"
		},
		body: JSON.stringify(dataObj)
	}
	try{
		let res = await fetch(url,requestData);
		console.log(res);
		if (res.ok){
			let resData = await res.json();
			return resData;
		} else {
			console.log('----', res.ok, res.status, res.statusText);
      // throw new Error("The server returned an error");
			return {code:res.status, text:res.statusText}
		}
	} catch (error) {
    return 'Error conaction';
  }

}

// *****************

let urls = {
	createUser:'http://127.0.0.1:8000/api/v1/auth/users/',
	loginUser:'http://127.0.0.1:8000/api/v1/auth/token/login/',
}

	// 'Authorization':"Token 1b6121b612869f05677e03188df0281c959f702e"


async function addUserFunction(e){
	e.preventDefault();
	let form = document.forms[0];
	let username = form.un.value;
	let password = form.pw.value;
	let email = form.em.value;
	
	let data = {
		username,
		password,
		email
	}
	console.log(data);
	
	resp = await requestPOST(urls.createUser, data);
	console.log(userTOKEN);
}

async function loginUserFunction(e){
	e.preventDefault();
	let form = document.forms[1];
	let username = form.un.value;
	let password = form.pw.value;
	
	let data = {
		username,
		password
	}
	console.log(data);
	
	let userTOKEN = await requestPOST(urls.loginUser, data)
	console.log(typeof(userTOKEN), userTOKEN);
	if (!('auth_token' in userTOKEN)){
		console.log("Failed to login", userTOKEN.code, userTOKEN.text);
	} else {
		userTOKEN = userTOKEN.auth_token;
		console.log(userTOKEN.auth_token);
	}

}