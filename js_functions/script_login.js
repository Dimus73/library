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
    return 'Error conaction';
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

	addBookToLibrary:  'http://127.0.0.1:8000/api/v1/library/' 
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

async function addBook(e){
	e.preventDefault();
	let bookInfo={
		title: "New book",
		author: "Author1, Aut2",
		// img: "http://127.0.0.1:8000/media/cat.jpeg",
		googl_id: "khjgkf76",
		actual: true,
		age_range: 1
	}
	res = await requestPOST (urls.addBook, bookInfo, userTOKEN);
	console.log('Book added:', res);
}

	
// *********************************************
// *********************************************
// -----------Library
async function addBookToLibrary(e){
	e.preventDefault();
	let form=document.forms['add_book_library'];
	console.log(form);
	let libraryInfo={
		book: form.elements.bookid.value,
		user: localStorage.getItem('user_id'),
		comment: form.elements.comment.value,
	}
	form.elements.userid.value = localStorage.getItem('user_id');
	let token=localStorage.getItem('token');
	res = await requestPOST (urls.addBookToLibrary, libraryInfo, token);
	console.log('Book added to library:', res);
	form.elements.res.value = 'Book added to library'
}


