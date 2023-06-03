// Где-то в глобальной переменной нужно хронить токен пользователя - Это его идентификатор
let userTOKEN=''
let divUser = document.querySelector('#user');
let divID =document.querySelector('#user_id');
let divToken =document.querySelector('#token');

// *****************
async function requestPOST(url, dataObj={}, token=''){
	let requestData={
		method:'POST',
		headers:{
			"Content-Type": "application/json",
		},
		body: JSON.stringify(dataObj)
	}

	console.log(requestData);
	
	if (token != ''){
		requestData.headers.Authorization = ("Token " + token);
	}
	console.log(requestData);

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
		console.log(error);
    return 'Error connection';
  }

}

async function requestGET(url, options={}){
	const param = new URLSearchParams();
	for (p in options){
		param.append(p,options[p])
	}
	console.log('GET запрос:', url + '?' + param);
	try {
		res= await fetch(url + '?' + param);
		console.log(res);
		if (!res.ok){
			return("Error in Get Request(dima)");
		} else {
			let res_Js = res.json();
			return res_Js;
		}
	} catch (error) {
		
	}
}
// *****************

let urls = {
	createUser:        'http://127.0.0.1:8000/api/v1/auth/users/',
	// loginUser:         'http://127.0.0.1:8000/api/v1/auth/token/login/',
	loginUser:         'http://127.0.0.1:8000/api/v1/auth/authenticate/',
	logoutUser:        'http://127.0.0.1:8000/api/v1/auth/token/logout/',
	currentUser:       'http://127.0.0.1:8000/api/v1/auth/users/me/',

	getAllBooks:       'http://127.0.0.1:8000/api/v1/book/',
	addBook:           'http://127.0.0.1:8000/api/v1/book/',

	getAllAgeRange:    'http://127.0.0.1:8000/api/v1/age/',

	searchByGoogleID:  'http://127.0.0.1:8000/api/v1/ggl/',
}



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
	
	userTOKEN = await requestPOST(urls.loginUser, data)
	console.log(typeof(userTOKEN), userTOKEN);
	if (!('token' in userTOKEN)){
		console.log("Failed to login", userTOKEN.code, userTOKEN.text);
	} else {
		localStorage.setItem('token', userTOKEN.token);
		localStorage.setItem('user_id', userTOKEN.id);
		console.log(userTOKEN);
		divUser.textContent = username;
		divID.textContent = userTOKEN.id;
		divToken.textContent = userTOKEN.token;
	}
}

async function logoutUserFunction(e){
		e.preventDefault();
		console.log('*****User logout', userTOKEN);

		let res = await requestPOST(urls.logoutUser, {}, userTOKEN);
		console.log(typeof(res), res);

		divUser.textContent = 'Undefined';
		divToken.textContent = '';
	
}

async function currentUserInfo(e){
	e.preventDefault();
	let token=localStorage.getItem('token');
	res = await requestGET(urls.currentUser)
	console.log(res);

	let listDiv = document.querySelector('#user_info')
	listDiv.textContent='';
	let ul = document.createElement('ul');
	for (t in res){
		let li = document.createElement('li');
		li.innerHTML = t +": <b>" + book[t] + '</b>'
		ul.appendChild(li);
	}
	listDiv.appendChild(ul);

}

// *********************************************
// *********************************************
// -----------Books
async function getAllBooks(e){
	e.preventDefault();

	let res = await requestGET(urls.getAllBooks);
	console.log(res);
	let listDiv = document.querySelector('#books_list')
	listDiv.textContent='';
	for (book of res){
		let ul = document.createElement('ul');
		for (t in book){
			let li = document.createElement('li');
			li.innerHTML = t +": <b>" + book[t] + '</b>'
			ul.appendChild(li);
		}
		listDiv.appendChild(ul);
		let hr = document.createElement('hr');
		listDiv.appendChild(hr);
	}
}

function clearBooksList(e){
	e.preventDefault();
	let listDiv = document.querySelector('#books_list')
	listDiv.textContent = '';

}

async function addBook(e){
	e.preventDefault();
	let form=document.forms['add_book'];
	console.log(form);
	let bookInfo={
		title: form.elements.title.value,
		author: form.elements.author.value,
		img: form.elements.img.value,
		googl_id: form.elements.googl_id.value,
		actual: true,
		age_range: form.elements.age_range.value
	}
	let token=localStorage.getItem('token');
	res = await requestPOST (urls.addBook, bookInfo, token);
	console.log('Book added:', res);
	form.elements.res.value = 'Book added: "'+ res.title + '"'
}

// *********************************************
// *********************************************
// -----------Age Range
async function getAllAgeRange(e){
	e.preventDefault();

	let res = await requestGET(urls.getAllAgeRange);
	console.log(res);
	let ageRangeObj ={}
	for (r of res){
		ageRangeObj[r.range]=r.id;
	}
	console.log(ageRangeObj);
	let select = document.querySelector('#age_range')
	for (key in ageRangeObj){
		let opt = document.createElement('option');
		opt.setAttribute('value', ageRangeObj[key]);
		opt.textContent = key;
		select.appendChild(opt);
	}
	
}

// *********************************************
// *********************************************
// -----------Search in Books by Google_id
async function searcheByGooglId(e){
	e.preventDefault();
	let form=document.forms['googl_id'];
	let searcheID = form.elements.id.value
	let res = await requestGET(urls.searchByGoogleID  + searcheID);
	console.log(res);

	let listDiv = document.querySelector('#ggl_found')
	listDiv.textContent='';
	let ul = document.createElement('ul');
	for (t in res){
		let li = document.createElement('li');
		li.innerHTML = t +": <b>" + res[t] + '</b>'
		ul.appendChild(li);
	}
	listDiv.appendChild(ul);
	let hr = document.createElement('hr');
	listDiv.appendChild(hr);
}

	


