const express = require("express");
const axios = require("axios").default;

const app = express();

app.get("/characters", (req, res) => {
  axios
    .get("https://rickandmortyapi.com/api/character", {
      params: req.query,
    })
    .then((response) => {
      const characters = response.data.results;
      res.json(characters);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/character/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const response = await axios.get(`https://rickandmortyapi.com/api/character/${id}`)
    const character = response.data;
    res.json(character);
  } catch(e) {
    res.send(e)
  }
});

app.get("/character/:id/episodes", (req, res) => {
  const { id } = req.params;
  axios.get(`https://rickandmortyapi.com/api/character/${id}`)
    .then((response) => {
      const character = response.data;
      const characterEpisodes = character.episode;

      const episodesIds = characterEpisodes.map((episode) => {
        return episode.split('episode/')[1]
      })
      const idsString = episodesIds.join(",")
      console.log(idsString);
      axios.get(`https://rickandmortyapi.com/api/episode/${idsString}`)
        .then((response) => {
          const filteredResponse = response.data.map((episode) => {
            return {
              id: episode.id,
              name: episode.name,
              air_date: episode.air_date,
              episode: episode.episode,
            }
          })
          res.json(filteredResponse)
        })
        .catch((error) => {
          res.send(error)
        })
    })
    .catch((error) => {
      res.send(error)
    })
})

app.listen(3000, () => {
  console.log("Server is running");
});
