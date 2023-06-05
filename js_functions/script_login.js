// Где-то в глобальной переменной нужно хронить токен пользователя - Это его идентификатор
let userTOKEN=''
let divUser = document.querySelector('#user');
let divID =document.querySelector('#user_id');
let divToken =document.querySelector('#token');
let divUserProfileID =document.querySelector('#user_profile_id');


const profileFialds = {
	Email:'Email ',
	first_name:'First name: ',
	last_name:'Last name: ',
	phone:'Phone: ',
	city:'City: ',
	address:'Address: ',
	geo_latitudes:'Geo latitudes: ',
	geo_longitude:'Geo longitude: '
}

// Creating fields in the login/profile form
let divProfile = document.getElementById('user_profile');
for (i in profileFialds){
	let newInputLable = document.createElement('lable')
	newInputLable.for = i;
	newInputLable.textContent = profileFialds[i];
	let newInput = document.createElement('input');
	newInput.name = i;
	newInput.style.marginRight = '10px';
	newInput.style.marginTop = '5px';
	divProfile.appendChild(newInputLable);
	divProfile.appendChild(newInput);
}


// *****************
// Basic Function Post Request
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
			return {code:res.status, text:res.statusText, ok:res.ok}
		}
	} catch (error) {
		console.log(error);
    return 'Error connection';
  }

}

// Basic Function Get Request
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

// API address list
let urls = {
	createUser:        'http://127.0.0.1:8000/api/v1/auth/users/',
	// loginUser:         'http://127.0.0.1:8000/api/v1/auth/token/login/',
	loginUser:         'http://127.0.0.1:8000/api/v1/auth/authenticate/',
	logoutUser:        'http://127.0.0.1:8000/api/v1/auth/token/logout/',
	currentUser:       'http://127.0.0.1:8000/api/v1/auth/users/me/',
	createProfile:     'http://127.0.0.1:8000/api/v1/profile',

	getAllBooks:       'http://127.0.0.1:8000/api/v1/book/',
	addBook:           'http://127.0.0.1:8000/api/v1/book/',

	getAllAgeRange:    'http://127.0.0.1:8000/api/v1/age/',

	searchByGoogleID:  'http://127.0.0.1:8000/api/v1/ggl/',

	addBookToLibrary:  'http://127.0.0.1:8000/api/v1/library/', 
	allBooksInLibrary: 'http://127.0.0.1:8000/api/v1/library/list' 
}


// Add user function
async function addUserFunction(e){
	e.preventDefault();
	let form = document.forms['new_profile'].elements;
	console.log(document.forms['new_profile'],document.forms['new_profile'].elements);
	let username = form.un.value;
	let password = form.pw.value;
	let Email = form.Email.value;
	
// Create a user
	let data = {
		username,
		password,
		Email
	}
	console.log(data);
	
	resp = await requestPOST(urls.createUser, data);
	console.log ('After creating a user',resp);

	// If the user is created, log in with his login
	if (!('ok' in resp)){ 
		let log_res = await LoginUserFunction(username, password);

		// If the user is login, create his profile
		if (log_res){
			data={};
			for (i in profileFialds){
				data[i]=form[i].value;
			}
			data['geo_latitudes'] = data['geo_latitudes'] == '' ? 0: data['geo_latitudes']
			data['geo_longitude'] = data['geo_longitude'] == '' ? 0: data['geo_longitude']
			

			resp = await requestPOST(urls.createProfile, data, localStorage.getItem('token'))
			console.log('After creating a profile',resp);
			if (resp.ok){
				localStorage.setItem('user_profile_id', resp.user_profile_id);
				divUserProfileID.textContent = resp.user_profile_id;
			}
		}
	}

}

// Event Login function (button)
async function eventLoginUserFunction(e){
	e.preventDefault();
	let form = document.forms['login'].elements;

	let username = form.un.value;
	let password = form.pw.value;

	await LoginUserFunction(username, password);
	
	divUser.textContent = username;
	divID.textContent = localStorage.getItem('user_id');
	divToken.textContent = localStorage.getItem('token');
}


// login function
async function LoginUserFunction(username, password){

	let data = {
		username,
		password
	}
	console.log(data);
	
	userTOKEN = await requestPOST(urls.loginUser, data)
	console.log(typeof(userTOKEN), userTOKEN);
	if (!('token' in userTOKEN)){
		console.log("Failed to login", userTOKEN.code, userTOKEN.text);
		return false
	} else {
		localStorage.setItem('token', userTOKEN.token);
		localStorage.setItem('user_id', userTOKEN.id);
		localStorage.setItem('user_profile_id', userTOKEN.profile_id);
		console.log(userTOKEN);
		divUser.textContent = username;
		divID.textContent = userTOKEN.id;
		divToken.textContent = userTOKEN.token;
		divUserProfileID.textContent = userTOKEN.profile_id;
		return true
	}
}



// Login function
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

// All books from books model
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

//Add Book to Books model
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
//get Age Range list
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

	
// *********************************************
// *********************************************
// -----------Library

//Add book to the library
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

//All books in the librari
async function allBooksInLibrary(e){
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

function clearLibraryBooksList(e){
	e.preventDefault();
	let listDiv = document.querySelector('#books_list')
	listDiv.textContent = '';

}

