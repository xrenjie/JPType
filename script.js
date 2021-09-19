//load constants
const categories = ["./jlpt1adj.json",  "./jlpt1noun.json", "./jlpt1verb.json"];
const wordElement = document.getElementById("word");
const messageElement = document.getElementById("message");
const typedValueElement = document.getElementById("typed-value");
const hintElement = document.getElementById("hint");
const typeElement = document.getElementById("wordtype");

//load words
let words = [];
function loadWords(){

  for (let i=0; i<categories.length; i++){
    let arr = [];
    const response = fetch(categories[i])
    .then((response) => response.json())
    .then(data => {return data;});
  
    const getWords = async () => {
    const a = await response;
    for(const word of a){
      arr.push(word);
      }
    };
    getWords();

    words.push(arr);
  }
  
}
loadWords();

const catMap = new Map([["adj",0], ["noun",1], ["verb",2], ["all",3]]);

//on click start button, start logic
document.getElementById("start").addEventListener("click", () => {
  let score = 0;
  let word = "";
  let category = catMap.get(typeElement.value);

  //reset state
  messageElement.innerHTML = "Score: 0";
  wordElement.innerHTML = "";

  //get random word
  if(category===3){
    let wordIndex1 = Math.floor(Math.random() * 3);
    let wordIndex2 = Math.floor(Math.random() * words[wordIndex1].length);
    word = words[wordIndex1][wordIndex2];
  }
  else{
    let wordIndex = Math.floor(Math.random() * words[category].length);
    word = words[category][wordIndex];
  }

  wordElement.innerHTML = word.kanji;

  typedValueElement.value = "";
  // set focus
  typedValueElement.focus();
  // set the event handler
  typedValueElement.addEventListener('input', () => {
    
    let typedValue = typedValueElement.value;

    //correct word typed
    if (typedValue === word.kanji || typedValue === word.kana) {
      wordElement.className="highlight";
      typedValueElement.addEventListener("keydown", (e)=>{
        //submit and reset on enter key press
        if(e.key === "Enter"){
          if (typedValue === word.kanji || typedValue === word.kana) {
            messageElement.innerHTML = `Score: ${++score}`;
            wordElement.className="";
            wordElement.innerHTML = "";
            if(category===3){
              let wordIndex1 = Math.floor(Math.random() * 3);
              let wordIndex2 = Math.floor(Math.random() * words[wordIndex1].length);
              word = words[wordIndex1][wordIndex2];
            }
            else{
              let wordIndex = Math.floor(Math.random() * words[category].length);
              word = words[category][wordIndex];
            }
            wordElement.innerHTML = word.kanji;
            //clear textbox
            typedValueElement.value = "";
          }
        }
      });
      
    } 
    else{
      wordElement.className="";
    }
  });

  //hint and def key
  typedValueElement.addEventListener("keydown", (e) => {
    if(e.ctrlKey)
    {hintElement.innerHTML = word.kana;}
    else if(e.shiftKey)
    {hintElement.innerHTML = word.def;}
  });
  typedValueElement.addEventListener("keyup", (e) => {
    hintElement.innerHTML = "<br>";
  });

});
