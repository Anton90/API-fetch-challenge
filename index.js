const resultDiv = document.querySelector('#result');
const cardsDiv = document.querySelector('#cards');
const pagination = document.querySelector('.pagination');



const pickRandom = () => {
    fetch('https://api.punkapi.com/v2/beers/random')
        .then((response) => response.json())
        .then((response) => resultDiv.innerHTML = `<pre>${JSON.stringify(response, null, 5)}</pre>`);
};

const pageLink = (page) => `https://api.punkapi.com/v2/beers?page=${page}&per_page=20`;

const handlePageClick = () => {
    let link = event.target;
    let page = link.getAttribute('data-page');
    console.log(link.getAttribute('data-page'));
    beerPage(page);
}

const beerPage = (page) => {
    fetch(pageLink(page))
        .then((response) => response.json())
        .then((response) => {
            cardsDiv.innerHTML = '';
            beerCard(response);
        }
        )
};

const beerCard = (response) => {
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
};


beerPage(5);

const paginate = (page) => {
    let previous = `<li class="page-item"><span class="page-link" data-page="${page - 1}">${page - 1}</span></li>`;

    page == 1 ? previous = '' : previous;

    let current = `<li class="page-item"><span class="page-link" data-page="${page}">${page}</span></li>`;
    pagination.innerHTML = `${previous}${current}`;


    // page = 1 ? previous =
    //     pagination.innerHTML = `

    // <li class="page-item"><a class="page-link" href="#">1</a></li>
    // <li class="page-item"><a class="page-link" href="#">2</a></li>
    // <li class="page-item"><a class="page-link" href="#">3</a></li>
    // <li class="page-item">
    //     <a class="page-link" href="#" aria-label="Next">
    //         <span aria-hidden="true">&raquo;</span>
    //     </a>
    // </li>
    // `;

    let pageLinks = document.querySelectorAll('.page-link');

    pageLinks.forEach(link => link.addEventListener('click', handlePageClick))


};

paginate(3);

document.querySelector('#pickRandom').addEventListener('click', pickRandom);

/* <li class="page-item">
    <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
    </a>
</li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
        <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
        </a>
    </li> */