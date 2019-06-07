// Handles
const resultDiv = document.querySelector('#result');
const cardsDiv = document.querySelector('#cards');
const pagination = document.querySelector('.pagination');
const modalDiv = document.querySelector('#modal');
const sortDropdown = document.querySelector("#dropdown");


// API links
const pageLink = (page) => `https://api.punkapi.com/v2/beers?page=${page}&per_page=65`;
const beerLink = (id) => `https://api.punkapi.com/v2/beers/${id}`;

// data container and related
let data = [];
let sortingOrder = '';
let selectArray = [
	"name",
	"abv",
	"ebc",
	"ph"
];


// const fillSelectArray = () => {

// 	data.forEach(item => selectArray.push(item.id)); 
// 	console.log(data); 
// } 


 

const pageLen = 50;
const paginate = (data, page) => {
	let total = data.length;
	for (let i = 1; i <= Math.ceil(total / pageLen); i++) {
		pagination.innerHTML +=
			`<li class="page-item"><span class="page-link" data-page="${i}">${i}</span></li>`;
	}

	let pageLinks = document.querySelectorAll('.page-link');
	document.querySelector(`.page-link[data-page='${page}']`)
		.parentElement.classList.add('active');

	pageLinks.forEach(link => link.addEventListener('click', handlePageClick))

};


const handlePageClick = () => {
	const pageItems = document.querySelectorAll('.page-item');
	let link = event.target;
	let page = link.getAttribute('data-page');
	beerPage(data, page);
	pageItems.forEach((item) => item.classList.remove("active"));
	document.querySelector(`.page-link[data-page='${page}']`)
		.parentElement.classList.add('active');
}

//Function to capitalize first letter for dropdown menu
const uCFirst = sentence => {
  let words = sentence.split(" ");
  words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)); 
  return words.join(" ");
};

//Function to sort items
const addSortItems = () => {
	selectArray.forEach(item => {
		sortDropdown.innerHTML += `<a class="dropdown-item" id="${item}">${uCFirst(item)}</a>`;
	}) 
};

addSortItems(); 

const handleSortClick = () => {
	sortingOrder = event.srcElement.id;  
	buildPage(); 
}


//Function to display all key/values
const modalInfo = (response) => {
	let buffer = `<ul>`;
	//console.log(response);

	if (response != null) {
		for (let [key, value] of Object.entries(response)) {

			if (value != null || value != "" || typeof (value) !== undefined) {

				if (typeof (value) === 'object') {
					buffer += `<li><b>${key}:</b>`;
					buffer += `${modalInfo(value)}</li>`;
				} else {
					buffer += `<li><b>${key}</b>: ${value}</li>`;
				}
			}
		}
	}
	buffer += `</ul>`
	return buffer;
}


// Function to collect info for modal and construct corresponding html
const showModal = (id) => {
	let targetModal = document.querySelector(`#b${id}`);
	fetch(beerLink(id))
		.then((response) => response.json())
		.then((response) => {
			modalDiv.innerHTML +=
				`<div class="modal fade" id="b${id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
				<div class="modal-dialog modal-dialog-scrollable" role="document">
					<div class="modal-content">
				   	<div class="modal-header">
							<h5 class="modal-title" id="b${id}Title">${response[0].name}</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				          	<span aria-hidden="true">&times;</span>
				        	</button>
				      </div>
				      <div class="modal-body">
				        ${modalInfo(response[0])}
				      </div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>`;
		})
	return;
};


// Function to generate main page content
const beerPage = (data, page) => {

	cardsDiv.innerHTML = '';
	let begin = (page - 1) * pageLen;
	let end = page * pageLen - 1;
	let subset = data.slice(begin, end);
	//console.log(subset);
	beerCard(subset);

	document.querySelectorAll('.beerDetail')
		.forEach(bd => bd.addEventListener('click', (e) => showModal(e.target
			.getAttribute('data-id'))));

};

// Function to construct a card for a beer
const beerCard = (response) => {
	//console.log(response[0]);
	for (let i = 0; i < response.length; i++) {

		let imageSrc = response[i].image_url;
		if (imageSrc == null) {
			imageSrc = "no-image.png";
		}

		let beerName = response[i].name;
		if (beerName == "" || beerName == null) {
			beerName = "";
		}

		let beerTag = response[i].tagline;
		if (beerTag == "" || beerName == null) {
			beerTag = "";
		}

		let beerDesc = response[i].description;
		if (beerDesc == "" || beerDesc == null) {

			beerDesc = "";
		}

		cardsDiv.innerHTML += `
			<div class="card m-2" style="max-width: 200px; max-height: " >
                <img class="card-img-top" style="max-width: 100%;" src="${imageSrc}" alt="${beerName}">
				<div class="card-body d-flex flex-column">
                  <h5 class="card-title">${beerName}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">${beerTag}</h6>
                  <p class="card-text">${beerDesc}</p>
                  <button type="button" class="btn btn-primary mt-auto beerDetail" data-toggle="modal" data-target="#b${response[i].id}" data-id="${response[i].id}">Show me more</button>
				</div>
        	</div>`;
	}
};


//Function for random beercard
const randomBeer = () => {
	let rand = Math.floor(Math.random() * data.length);

	fetch(`https://api.punkapi.com/v2/beers/${rand}`)
		.then((response) => response.json())
		.then((response) => {

			//beerCard(response); 
			console.log(response);


			let imageSrc = response[0].image_url;
			if (imageSrc == null) {
				imageSrc = "no-image.png";
			}

			let beerName = response[0].name;
			if (beerName == "" || beerName == null) {
				beerName = "";
			}

			let beerTag = response[0].tagline;
			if (beerTag == "" || beerName == null) {
				beerTag = "";
			}

			let beerDesc = response[0].description;
			if (beerDesc == "" || beerDesc == null) {
				beerDesc = "";
			}

			resultDiv.innerHTML = `
			<div class="card m-2" style="max-width: 400px; max-height: " >
                <img class="card-img-top" style="max-width: 100%;" src="${imageSrc}" alt="${beerName}">
				<div class="card-body d-flex flex-column">
                  <h5 class="card-title">${beerName}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">${beerTag}</h6>
                  <p class="card-text">${beerDesc}</p>
                  <button type="button" class="btn btn-primary mt-auto beerDetail" data-toggle="modal" data-target="#b${response[0].id}" data-id="${response[0].id}">Show me more</button>
				</div>
        	</div>`;

			document.querySelector('.beerDetail').addEventListener('click', (e) =>
				showModal(e.target.getAttribute('data-id')));

		})
}

const getAllBeers = async () => {
	let allBeers = [];
	let allBeersCounter = 1;
	let id = 1;
	while (allBeersCounter != 'STOP') {
		try {
			let result = fetch(pageLink(id));
			let data = await result;
			let jsonData = await data.json();
			jsonData.forEach((beer) => allBeers.push(beer));
			//console.log(jsonData);
			id++;
			allBeersCounter = jsonData[0].id;
		}
		catch (err) {
			allBeersCounter = 'STOP';
			console.log(`STOP ${err}`);
		}
	} 
	return allBeers; 
} 



document.querySelector('#pickRandom').addEventListener('click', randomBeer);
document.querySelector('#reset').addEventListener('click', () => resultDiv.innerHTML = "")
dropdown.addEventListener('click', handleSortClick);


// Now do it!
const init = async () => {
	let page = 1;
	cardsDiv.innerHTML = `<h3>Waiting for a truckload of beers! Hold on ...</h3>`;

	data = await getAllBeers();
	paginate(data, page);
	buildPage();
};


const buildPage = () => {
	let page = 1;
	data.sort(sorter);
	beerPage(data, page);

	//console.log(data);

};

init();



const sorter = (a, b) => {
	//console.log("A: " + a[sortingOrder]);
	//console.log("B: " + b[sortingOrder]);
	//console.log(sortingOrder); 

	if (a[sortingOrder] > b[sortingOrder]) {
		return 1;
	}
	if (a[sortingOrder] < b[sortingOrder]) {
		return -1;
	}
	return 0;
};
 