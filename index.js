const app = document.createElement("div");
app.classList.add("app-container");

document.body.appendChild(app);

const baseUrl = "https://pokeapi.co/api/v2/pokemon";

const loading = document.createElement("p");
loading.innerText = "Loading...";
loading.classList.add("loading");

const heading = document.createElement("div");
heading.classList.add("heading");

const logo = document.createElement("img");
logo.src = './images/pokemon-logo.png';
logo.classList.add("logo");


heading.appendChild(logo);

app.appendChild(heading);

let start = 0;
let length = 8;
let pokemonIds = range(start);

const loadNextSet = () => {
  start = start + length;
  pokemonIds = range(start);
  load();
};
const loadNPrevtSet = () => {
  start = start - length;
  pokemonIds = range(start);
  load();
};
const createButtons = () => {
  const buttonSection = document.createElement("div");

  const ball = document.createElement("img");
  ball.src = "./images/ball.png";
  ball.classList.add("ball");
  buttonSection.appendChild(ball);

  buttonSection.classList.add("button-header");

  const prevButton = document.createElement("img");
  prevButton.src = "./images/prev.png";
  prevButton.classList.add("prev-button");

  prevButton.onclick = () => loadNPrevtSet();

  const nextButton = document.createElement("img");
  nextButton.src = "./images/prev.png";
  nextButton.classList.add("next-button");

  nextButton.onclick = () => loadNextSet();

  buttonSection.appendChild(prevButton);
  buttonSection.appendChild(nextButton);

  app.appendChild(buttonSection);
};

createButtons();

function range(start) {
  return Array.from({ length: length }, (v, k) => start + k + 1);
}

async function getPokemon(id) {
  const resp = await fetch(`${baseUrl}/${id}`);
  const result = await resp.json();
  return result;
}

const capitalize = (word) => {
  return word[0].toUpperCase() + word.slice(1, word.length);
};

function getImageFlipCard(pokemon) {
  const pokemonImgContainer = document.createElement("div");
  pokemonImgContainer.classList.add("pokemon-img-container");

  const pokemonFrontImgContainer = document.createElement("div");
  pokemonFrontImgContainer.classList.add("pokemon-front-img-container");
  const pokemonImage = document.createElement("img");
  pokemonImage.classList.add("pokemon-img");
  pokemonImage.src =
  pokemon.sprites?.other["official-artwork"].front_default||
    pokemon.sprites?.other?.dream_world?.front_default ||
    pokemon.sprites.front_default;
  pokemonFrontImgContainer.appendChild(pokemonImage);
  pokemonImgContainer.appendChild(pokemonFrontImgContainer);

  return pokemonImgContainer;
}
function getCardHeader(pokemon) {
  const cardHeader = document.createElement("div");
  cardHeader.classList.add("pokemon-card-header");

  const name = document.createElement("div");
  name.innerText = capitalize(pokemon.name);
  name.classList.add("pokemon-name");
  cardHeader.appendChild(name);

  const hp = document.createElement("div");
  hp.innerHTML = `<small>HP</small>${pokemon.base_experience}`;
  hp.classList.add("pokemon-hp");
  cardHeader.appendChild(hp);

  return cardHeader;
}
function getDescription(pokemon){
  const description = document.createElement("div");
  const desc = document.createElement("p");
  desc.classList.add("pokemon-desc");
  const type = pokemon.types[0].type.name;
  const weight = pokemon.weight;
  const name = capitalize(pokemon.name);

  desc.innerText = `${name} is a ${type} pokemon of weight ${weight} lbs.`;
  description.appendChild(desc);
  return description;
}
function getCardContent(pokemon) {
  const info = document.createElement("div");
  info.classList.add("pokemon-info");

  const topTwoMoves = pokemon.moves.slice(0, 2);

  topTwoMoves.map((m, index) => {
    const moveandstats = document.createElement("div");
    moveandstats.classList.add("pokemon-move-stats");

    const move = document.createElement("p");
    move.classList.add("pokemon-move");
    const moveName = capitalize(m.move.name);
    move.innerText = moveName;
    moveandstats.appendChild(move);

    const stats = document.createElement("p");
    stats.classList.add("pokemon-stats");
    stats.innerText = pokemon.stats[index].base_stat;
    moveandstats.appendChild(stats);

    info.appendChild(moveandstats);
  });

  return info;
}
function getFooter(pokemon) {
  const cardFooter = document.createElement("div");
  cardFooter.classList.add("pokemon-card-footer");

  [10, 20, 30].map((boxIndex) => {
    const box = document.createElement("div");
    box.classList.add("pokemon-gray-box");
    box.innerText = `weakness ${boxIndex}`;
    cardFooter.appendChild(box);
  });
  return cardFooter;
}

function createPokemon(pokemon) {
  const pokemonCard = document.createElement("div");
  pokemonCard.id = "pokemonCard";
  pokemonCard.classList.add("pokemon-card");

  const pokemonElem = document.createElement("div");
  pokemonElem.id = "pokemonContainer";
  pokemonElem.classList.add("pokemon-container");

  const cardHeader = getCardHeader(pokemon);
  pokemonElem.appendChild(cardHeader);

  const pokemonImage = getImageFlipCard(pokemon);
  pokemonElem.appendChild(pokemonImage);

  const cardDesc = getDescription(pokemon);
  pokemonElem.appendChild(cardDesc);

  const pokemonInfo = getCardContent(pokemon);
  pokemonElem.appendChild(pokemonInfo);

  const pokemonFooter = getFooter(pokemon);
  pokemonElem.appendChild(pokemonFooter);

  pokemonCard.appendChild(pokemonElem);

  return pokemonCard;
}

async function load() {
  app.appendChild(loading);

  const pokemonContainer = document.querySelector(".pokemon-grid");
  pokemonContainer && app.removeChild(pokemonContainer);

  let pokemonGrid = document.createElement("div");
  pokemonGrid.classList.add("pokemon-grid");
  app.appendChild(pokemonGrid);

  pokemonIds.forEach(async (id) => {
    const pokemon = await getPokemon(id);
    pokemonGrid.appendChild(createPokemon(pokemon));
  });

  loading.remove();
}
load();
