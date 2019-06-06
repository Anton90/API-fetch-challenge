const resultDiv = document.querySelector('#result');
const cardsDiv = document.querySelector('#cards');
const pagination = document.querySelector('.pagination');
const modalDiv = document.querySelector('#modal');


const pickRandom = () =>
{
	fetch('https://api.punkapi.com/v2/beers/random')
		.then((response) => response.json())
		.then((response) => resultDiv.innerHTML =
			`<pre>${JSON.stringify(response, null, 5)}</pre>`);
};

const pageLink = (page) => `https://api.punkapi.com/v2/beers?page=${page}&per_page=65`;

const beerLink = (id) => `https://api.punkapi.com/v2/beers/${id}`;

const handlePageClick = () =>
{
	const pageItems = document.querySelectorAll('.page-item');
	let link = event.target;
	let page = link.getAttribute('data-page');
	beerPage(page);
	pageItems.forEach((item) => item.classList.remove("active"));
}

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
			// document.querySelectorAll('.beerDetail').forEach(bd => bd.addEventListener('click', (e) => showModal(e.target.getAttribute('data-id'))));
		})
};

const makeModalContainer = (id) =>
{
	let newModal = document.createElement('div');
	newModal.setAttribute('class', 'modal fade');
	newModal.id = `b${id}`;
	newModal.tabIndex = "-1";
	newModal.setAttribute('role', 'dialog');
	newModal.setAttribute('aria-labelledby', 'ModalScrollableTitle');
	newModal.setAttribute('aria-hidden', 'true');
	fetch(beerLink(id))
		.then((response) => response.json())
		.then((response) =>
		{
			newModal.innerHTML = `
				  <div class="modal-dialog modal-dialog-scrollable" role="document">
				    <div class="modal-content">
				      <div class="modal-header">
	    <h5 class="modal-title" id="exampleModalScrollableTitle">${response[0].name}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
				          <span aria-hidden="true">&times;</span>
				        </button>
				      </div>
				      <div class="modal-body">
				        ...
				      </div>
	      <div class="modal-footer">
				        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
	        <button type="button" class="btn btn-primary">Save changes</button>
				      </div>
	    </div>
	  </div>`;
		})
	modalDiv.appendChild(newModal);
	//modalDiv.innerHTML += `<div class="modal fade" id="${id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true"></div>`;
};

// const showModal = (id) => {
// 	//let targetModal = document.querySelector(`#${id}`);
// 	// fetch(beerLink(id))
// 	// 	.then((response) => response.json())
// 	// 	.then((response) => {
// 	// 		targetModal.innerHTML = `
// 	// 			  <div class="modal-dialog modal-dialog-scrollable" role="document">
// 	// 			    <div class="modal-content">
// 	// 			      <div class="modal-header">
// 	//     <h5 class="modal-title" id="exampleModalScrollableTitle">${response[0].name}</h5>
// 	//       <button type="button" class="close" data-dismiss="modal" aria-label="Close">
// 	// 			          <span aria-hidden="true">&times;</span>
// 	// 			        </button>
// 	// 			      </div>
// 	// 			      <div class="modal-body">
// 	// 			        ...
// 	// 			      </div>
// 	//       <div class="modal-footer">
// 	// 			        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
// 	//         <button type="button" class="btn btn-primary">Save changes</button>
// 	// 			      </div>
// 	//     </div>
// 	//   </div>
// 	// 	        `;
// 	// 	}
// 	// 	)
// 	return;
// };

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
				<div class="card" style="max-width: 200px; max-height: " >
                <img class="card-img-top" style="max-width: 100%;" src="${imageSrc}" alt="${beerName}">
				  <div class="card-body">
                  <h5 class="card-title">${beerName}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">${beerTag}</h6>
                  <p class="card-text">${beerDesc}</p>
                  <button type="button" class="btn btn-primary beerDetail" data-toggle="modal" data-target="#b${response[i].id}" data-id="${response[i].id}">Show me more</button>
				  </div>
        </div>`;

		makeModalContainer(response[i].id);
	}
};


beerPage(3);

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

paginate(3);

document.querySelector('#pickRandom')
	.addEventListener('click', pickRandom);