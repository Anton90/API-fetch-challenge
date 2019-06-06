const resultDiv = document.querySelector('#result');


const pickRandom = () => {
    fetch('https://api.punkapi.com/v2/beers/random')
        .then((response) => response.json())
        .then((response) => resultDiv.innerHTML = `<pre>${JSON.stringify(response, null, 5)}</pre>`);
};

document.querySelector('#pickRandom').addEventListener('click', pickRandom);