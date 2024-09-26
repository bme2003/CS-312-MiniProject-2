const express = require('express');
const axios = require('axios');
const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Home route to render input form
app.get('/', (req, res) => {
    res.render('index');
});

// Result route: fetch a joke and personalize it
app.get('/result', async (req, res) => {
    const name = req.query.name || "Chuck Norris"; 
    const category = req.query.category || "Any";  
    const jokeApiUrl = `https://v2.jokeapi.dev/joke/${category}`;
    const factApiUrl = 'https://uselessfacts.jsph.pl/api/v2/facts/random?language=en';

    try {
        // Fetch the joke from JokeAPI
        const jokeResponse = await axios.get(jokeApiUrl);
        let joke = '';
        if (jokeResponse.data.type === 'single') {
            joke = jokeResponse.data.joke;
        } else {
            joke = `${jokeResponse.data.setup} ${jokeResponse.data.delivery}`;
        }

        const personalizedJoke = joke.replace(/Chuck Norris/g, name);

        // Fetch a random fact from the updated Random Facts API
        const factResponse = await axios.get(factApiUrl, {
            headers: {
                Accept: 'application/json'
            }
        });
        
        // Log the response to see the fact
        console.log(factResponse.data);

        const randomFact = factResponse.data.text;

        // Render the result page with the personalized joke and random fact
        res.render('result', { name, personalizedJoke, randomFact });
    } catch (error) {
        console.error(error); // Log any errors that occur
        res.render('error', { message: 'Unable to retrieve a joke or fact. Please try again.' });
    }
});





// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
