// create a value that hold a reference to the main button so we can move it around the DOM
const button = document.getElementById('ask');
// create a reference to the container for the UI
const container = document.getElementById('container');
// this variable tracks where in the control flow jeeves currently is
let stage = 1;
// this is global variable hack to access the search query in every function
let searchQuery;
// error handling word base for words without wiki articles
const wordBank = ['book', 'business', 'child', 'company', 'country', 'day', 'eye', 'fact', 'family', 'government', 'hand', 'home', 'job', 'life', 'man', 'money', 'month', 'mother', 'night', 'number', 'people', 'Pluto', 'problem', 'question', 'room', 'school', 'Spiderman', 'Superman', 'student', 'Music', 'time', 'water', 'week', 'woman', 'word', 'work', 'world', 'year'];
//creates a reference for the voice of jeeves so we can change what he is saying
const jeevesVoice = document.getElementById('jeevesVoice');
// button which replaces game start button to advances down the stage tree with affirmative values
const buttonSure = document.createElement('button');
buttonSure.style.width = '143px';
buttonSure.innerText = "...sure.";
// button which replaces game start button to advances down the stage tree with nonaffirmative values
const buttonNo = document.createElement("button");
buttonNo.style.width = '143px';
buttonNo.innerText = "What, no?"

// this listener starts the control flow
button.addEventListener('click', function(){
  // stage 1 is the default flow stage
  if (stage === 1) {
    // searchTerm saved as a var to access in all stages of the function
    var searchTerm = document.getElementById('search').value;
    // reassingment to global so every listerer has access to value
    // great opportunity for refactoring because the listener has parameter options
    searchQuery = searchTerm;
    //first API data retrieval...gets rhyming words to simulate Jeeves hard of hearing
    $.get(`https://api.datamuse.com/words?rel_rhy=${searchTerm}`,
      // this function invokes if the get is a success
      (rhyme) => {
        // jeeves demonstrates his hard of hearing
        jeevesVoice.innerHTML = "Did you say " + rhyme[0].word + " ?";
        // edits the UI to remove the game start button
        button.remove();     
        // modifies the no to be reactive and incorporate user searchterm
        buttonNo.innerText = "What, no? " + searchTerm + ".";
        // changes the sure button to be less enthused
        buttonSure.innerText = "...sure.";
        // modify the ui to navigate the control flow
        $('#container').append(buttonSure);      
        $('#container').append(buttonNo);
        // update the game state to stage 2 
        stage = 2;   
        // this provides an error alert if we fail the get request
      }).fail(function(){
          alert("no rhyming words in database");
      });  
  }
});

// controls the NO button control flow
buttonNo.addEventListener('click', function(){
  // deny first rhyme value
  if (stage == 2) {
    //get second rhyme value
    $.get(`https://api.datamuse.com/words?rel_rhy=${searchQuery}`,
      // if we have a successful get we invoke this function
      (rhyme) => {
        //update UI response options and Jeeves output and game stage
        buttonSure.innerText = "*sigh*...okay.";
        buttonNo.innerText = "No, " + searchQuery + "!";
        jeevesVoice.innerHTML = "Oh, searching " + rhyme[1].word + "...";
        stage = 3;   
      }).fail(function(){
          alert("no rhyme in database");
      }); 
  }
  // deny second rhyme value
  else if (stage === 3) {
    // user has insisted we search the initial value, so we try
    $.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchQuery}`,
    // invoke this function if the get is a success
    (response) => {
      // if there is more than one wiki entry for the search term, return with word bank
      if (response.type === 'disambiguation') {
        // randomly access word bank with new index on every call
        const index = Math.floor(Math.random() * (37 - 0 + 1) + 0);
        // get the wiki entry for the word bank term
        $.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${wordBank[index]}`,
          // if it is a success, invoke
          (result) => {
            // update UI options and Jeeves output
            jeevesVoice.innerHTML = (`Oh, ${searchQuery}! If I recall...that is a ${result.description}!`);
            buttonSure.innerText = "...Thanks?";
            // penultimate game state, so only one button is needed to get to closing state
            buttonNo.remove();
            stage = 5;
          }).fail(() => {
            alert('get request failed');
        });
      }
      // if the wiki article has a description, we are good to go
      else {
        // update ui and game state, go to closing state
          jeevesVoice.innerHTML = (`Oh, ${searchQuery}! If I recall...that is a ${response.description}.`);
          buttonSure.innerText = "Wow...thanks!";
          buttonNo.remove();
          stage = 5;
      }
    }).fail(() => {
    alert('rhyme word one failure');
  }); 
    
  }
});

// this button controls the affirmative control flow
buttonSure.addEventListener('click', function(){
  //confirm first rhyme value
  if (stage == 2) {
    var firstRhymeWord;
    // this is a get request to find the next rhymeing value
    $.get(`https://api.datamuse.com/words?rel_rhy=${searchQuery}`,
      // if the get is a success, we invoke here
      (rhyme) => {
        // assign the rhyme as a variable to overcome an insertion bug
        firstRhymeWord = rhyme[0].word;
        // update the game state to track control flow
        stage = 3;   
        // if it fails, here is why
      }).fail(function(){
          alert("no rhyming words in database for " + searchQuery);
    });
    
    // get description for the rhyming word
    $.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${firstRhymeWord}`,
    // if we have a successful return, invoke
    (response) => {
      // if there are more than one wiki article
      if (response.type === 'disambiguation') {
        // random index finder
        const index = Math.floor(Math.random() * (37 - 0 + 1) + 0);
        // get wiki description for wrandom workBank value
        $.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${wordBank[index]}`,
          // if the get is a success, invoke
          (result) => {
            // update UI and game state
            jeevesVoice.innerHTML = (`Oh, ${firstRhymeWord}! If I recall...that is a ${result.description}!`);
            buttonSure.innerText = "...Thanks?";
            buttonNo.remove();
            stage = 5;
          }).fail(() => {
            alert('wiki get failure for ' + wordBank[index]);
        });
      }
      // if there is only one wiki article
      else {
          // update game state with retrieved value
          jeevesVoice.innerHTML = (`Oh, ${firstRhymeWord}! If I recall...that is a ${response.description}.`);
          buttonSure.innerText = "Wow...thanks!";
          buttonNo.remove();
          stage = 5;
      }
    }).fail(() => {
    alert('failure on finding wiki article for ' + firstRhymeWord);
  }); 

      
}
// confirm second rhyme value
else if (stage === 3) {
  // get next rhyme for the searchTerm
  $.get(`https://api.datamuse.com/words?rel_rhy=${searchQuery}`,
      // if it is a success, invoke
      (rhyme) => {
        // update global firstRhyme value for insertion bug
        firstRhymeWord = rhyme[1].word; 
      }).fail(function(){
          alert("no rhyme found for " + searchQuery);
    });
  // get description for firstRhymeWord
  $.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${firstRhymeWord}`,
    // if retrieved, invoke
    (response) => {
      // if there is more than one wiki for the word we are gonna use the word bank instead
      if (response.type === 'disambiguation') {
        //random index for word bank
        const index = Math.floor(Math.random() * (37 - 0 + 1) + 0);
        // return value for random word
        $.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${wordBank[index]}`,
          // if retrieved invoke
          (result) => {
            // update game state and UI
            jeevesVoice.innerHTML = (`Oh, ${firstRhymeWord}! If I recall...that is a ${result.description}!`);
            buttonSure.innerText = "...Thanks?";
            buttonNo.remove();
            stage = 5;
          }).fail(() => {
            alert('wiki failure for ' + wordBank[index]);
        });
      }
      // if only one wiki article
      else {
          //update penultimate game state and UI
          jeevesVoice.innerHTML = (`Oh, ${firstRhymeWord}! If I recall...that is a ${response.description}.`);
          buttonSure.innerText = "Wow...thanks!";
          buttonNo.remove();
          stage = 5;
      }
    }).fail(() => {
    alert('wiki database failure for' + firstRhymeWord);
  });
}
// if we are ending game
else if (stage === 5) {
  // provide closing game state and reset for next query
  jeevesVoice.innerHTML = "Oh yeah, I still got it!";
  stage = 1;
  buttonSure.remove();
  $('#container').append(button);
  document.getElementById('search').value = "";
  }
});
