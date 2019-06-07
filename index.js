// Handles
const resultDiv = document.querySelector('#result');
const cardsDiv = document.querySelector('#cards');
const pagination = document.querySelector('.pagination');
const modalDiv = document.querySelector('#modal');

// API links
const pageLink = (page) => `https://api.punkapi.com/v2/beers?page=${page}&per_page=65`;
const beerLink = (id) => `https://api.punkapi.com/v2/beers/${id}`;

// Utility functions for user interaction
const pickRandom = () =>
{
	fetch('https://api.punkapi.com/v2/beers/random')
		.then((response) => response.json())
		.then((response) => resultDiv.innerHTML =
			`<pre>${JSON.stringify(response, null, 5)}</pre>`);
};

document.querySelector('#pickRandom')
	.addEventListener('click', pickRandom);

const paginate = () =>
{

	for (let i = 1; i <= 5; i++)
	{
		pagination.innerHTML +=
			`<li class="page-item"><span class="page-link" data-page="${i}">${i}</span></li>`;
	}

	let pageLinks = document.querySelectorAll('.page-link');

	pageLinks.forEach(link => link.addEventListener('click', handlePageClick))

};


const handlePageClick = () =>
{
	const pageItems = document.querySelectorAll('.page-item');
	let link = event.target;
	let page = link.getAttribute('data-page');
	beerPage(page);
	pageItems.forEach((item) => item.classList.remove("active"));
}
//Function to display all key/values
const modalInfo = (response) => {
	let buffer = `<ul>`; 
	console.log(response);

	if (response != null ) {
		for (let [key, value] of Object.entries(response)) {

			if (value != null || value != "" || typeof(value) !== undefined) {
		  		
				  	if (typeof(value) === 'object'){
				  		buffer += `<li>${key}:`;
				  		buffer += `${modalInfo(value)}</li>`;
				  	}else {
				  		buffer += `<li><b>${key}</b>: ${value}</li>`; 
				  	}

			}
		}
	}
	buffer += `</ul>`
	return buffer; 
}


// Function to collect info for modal and construct corresponding html
const showModal = (id) =>
{
	let targetModal = document.querySelector(`#b${id}`);
	fetch(beerLink(id))
		.then((response) => response.json())
		.then((response) =>
		{
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
const beerPage = (page) =>
{
	fetch(pageLink(page))
		.then((response) => response.json())
		.then((response) =>
		{
			cardsDiv.innerHTML = '';
			beerCard(response);
			document.querySelector(`.page-link[data-page='${page}']`)
				.parentElement.classList.add('active');
			document.querySelectorAll('.beerDetail')
				.forEach(bd => bd.addEventListener('click', (e) => showModal(e.target
					.getAttribute('data-id'))));
		})
};

// Function to construct a card for a beer
const beerCard = (response) =>
{

	for (let i = 0; i < response.length; i++)
	{

		let imageSrc = response[i].image_url;
		if (imageSrc == null)
		{
			imageSrc = "no-image.png";
		}

		let beerName = response[i].name;
		if (beerName == "" || beerName == null)
		{
			beerName = "";
		}

		let beerTag = response[i].tagline;
		if (beerTag == "" || beerName == null)
		{
			beerTag = "";
		}

		let beerDesc = response[i].description;
		if (beerDesc == "" || beerDesc == null)
		{
			beerDesc = "";
		}

		cardsDiv.innerHTML += `
				<div class="card m-3" style="max-width: 200px; max-height: " >
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




// Now do it!
const init = () =>
{
	let page = 1;
	paginate(page);
	beerPage(page);
};

init();