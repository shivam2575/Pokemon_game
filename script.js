//for player1
const card1Ele = document.getElementById("card1");
const score1Ele = document.getElementById("p1_score");
const exp1Ele = document.getElementById("exp1");
let score1 = 0;

//for player2
const card2Ele = document.getElementById("card2");
const score2Ele = document.getElementById("p2_score");
const exp2Ele = document.getElementById("exp2");
let score2 = 0;

const fightBtnEle = document.getElementById("fight");

function fetchAllPokemon() {
  let pokemonList = [];
  let initialUrl = "https://pokeapi.co/api/v2/pokemon/";

  function fetchNextPokemon(url) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("some error occured while fetching");
        }
        return response.json();
      })
      .then((data) => {
        pokemonList = pokemonList.concat(
          data.results.map((pokemon) => ({
            name: pokemon.name,
            url: pokemon.url,
          }))
        );
        if (data.next) {
          return fetchNextPokemon(data.next);
        } else {
          return pokemonList;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return fetchNextPokemon(initialUrl);
}

function fetchPokemonDetails(url) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error("error while fetching pokemon details");
    }
    return response.json();
  });
}

function updatePokemonDetails(playerNumber, pokemon) {
  const imgEle = document.getElementsByClassName("img")[playerNumber - 1];
  const nameEle = document.getElementsByClassName("name")[playerNumber - 1];
  const expEle =
    document.getElementsByClassName("experience")[playerNumber - 1];
  const abiEle = document.getElementsByClassName("abilities")[playerNumber - 1];

  //updating name and exp
  nameEle.innerText = pokemon.name;
  expEle.innerText = pokemon.base_experience;

  //updating img
  const img = document.createElement("img");
  img.src = pokemon.sprites.front_default;
  imgEle.replaceChildren(img);

  //updating abilities list
  abiEle.innerHTML = "";
  pokemon.abilities.forEach((ability) => {
    const abilityEle = document.createElement("li");
    abilityEle.innerText = ability.ability.name;
    abiEle.appendChild(abilityEle);
  });
}

function updateScore() {
  const exp1 = parseInt(exp1Ele.innerText.trim());
  const exp2 = parseInt(exp2Ele.innerText.trim());
  console.log(`${exp1}vs${exp2}`);
  if (exp1 > exp2) {
    score1 += 1;
  } else if (exp1 < exp2) {
    score2 += 1;
  }
  score1Ele.innerText = `Score: ${score1}`;
  score2Ele.innerText = `Score: ${score2}`;
}

function showDetails() {
  fetchAllPokemon()
    .then((pokemonList) => {
      const randomIndex1 = Math.floor(Math.random() * pokemonList.length);
      const randomIndex2 = Math.floor(Math.random() * pokemonList.length);

      return Promise.all([
        fetchPokemonDetails(pokemonList[randomIndex1].url),
        fetchPokemonDetails(pokemonList[randomIndex2].url),
      ]);
    })
    .then(([pokemon1, pokemon2]) => {
      console.log(pokemon2);
      updatePokemonDetails(1, pokemon1);
      updatePokemonDetails(2, pokemon2);

      //delay before updating score
      return new Promise((resolve) => setTimeout(resolve, 1000));
    })
    .then(updateScore)
    .catch((err) => {
      console.error("error occured while fetching pokemon list: ", err);
    });
}

fightBtnEle.addEventListener("click", showDetails);
