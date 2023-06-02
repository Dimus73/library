// Functions -----+++****-----
console.log('Hello');

async function getDataFromAPI(str_q){
	try{
		let charecter = await fetch(str_q);
		let charecter_ob = await charecter.json();
		return charecter_ob;
	}catch{
		let('Error');
	}
}

  
// Get 40 books with image
async function search40books(search){
	let setOfBookObjects=[];
	let lengthOfSet = 20;
	let googlePosition = 0;
	let googleStep = 40;
	let q = search.split(' ').join('+');
	console.log(q);
	do {
		let str_q = 'https://www.googleapis.com/books/v1/volumes?q=' + q;
		str_q+= `&startIndex=${googlePosition}`;
		str_q+= `&maxResults=${googleStep}`;

		let response = await getDataFromAPI(str_q)
		// console.log(response.items);

		for (i of response.items){
			if (setOfBookObjects.length < lengthOfSet){
				try {
					setOfBookObjects.push({
					tytle:i.volumeInfo.title,
					author:i.volumeInfo.authors.join(', '),
					age_range:'???',
					img:i.volumeInfo.imageLinks.thumbnail,
					googl_id:i.volumeInfo.id
				})
				} catch (error) {
					continue;
				}
			} else{
				break
			}
		}
		googlePosition += googleStep;
	} while (setOfBookObjects.length < lengthOfSet)
	console.log(setOfBookObjects);
}

//START PROGRAM
let search = 'понедельник начинаетсяя в субботу'
search40books(search);