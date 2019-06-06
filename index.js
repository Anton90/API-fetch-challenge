const resultDiv = document.querySelector('#result');
const cardsDiv =  document.querySelector('#cards'); 


const pickRandom = () => {
    fetch('https://api.punkapi.com/v2/beers/random')
        .then((response) => response.json())
        .then((response) => resultDiv.innerHTML = `<pre>${JSON.stringify(response, null, 5)}</pre>`);
};

document.querySelector('#pickRandom').addEventListener('click', pickRandom);

const beerCard = () => {
	fetch('https://api.punkapi.com/v2/beers?page=1&per_page=20')
		.then((response) => response.json())
		.then((response) => {
			for (let i = 0; i < response.length; i++) {  
			cardsDiv.innerHTML += `
				<div class="card" style="max-width: 200px; max-height: " >
				  <img class="card-img-top" style="max-width: 100%;" src="${response[i].image_url}" alt="${response[i].name}">
				  <div class="card-body">
				    <h5 class="card-title">${response[i].name}</h5>
				    <h6 class="card-subtitle mb-2 text-muted">${response[i].tagline}</h6>
				    <p class="card-text">${response[i].description}</p>
				  </div>
				</div>
			`;
			} 
		}
		)
	};

beerCard(); 