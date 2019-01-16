const black = "black";
const white = "white";
const pieceClass = "piece";
const fieldClass = "field";
const kingBlack = "king-black";
const kingWhite = "king-white";
const highlightedClass = "highlighted";
let lastClicked = null;

function getPiece(event) {
  let piece = null;
  if (event.srcElement.classList.contains(pieceClass)) {
    const pieceElement = event.srcElement;
    let color;
    let isKing = false;
    if (pieceElement.classList.contains(black)) {
      color = black;
    } else {
      color = white;
    }
    if (pieceElement.classList.contains(kingBlack) || pieceElement.classList.contains(kingWhite)) {
      isKing = true;
    }
    piece = {
      color: color,
      isKing: isKing
    };
  }
  return piece;
}

function getField(fieldElement, piece) {
  let col = fieldElement.dataset.col;
  let row = fieldElement.dataset.row;
  return {
    col: col,
    row: row,
    piece: piece
  };
}

window.addEventListener("DOMContentLoaded", function(event) {
    //ToDo: Add to every Listener
    var changeFirstPlayerColorButton = document.getElementById("changeFirstPlayerColorButton");
    if(changeFirstPlayerColorButton)
      changeFirstPlayerColorButton.addEventListener("click", changeButtonColor);

    var changeSecondPlayerColorButton = document.getElementById("changeSecondPlayerColorButton");
    if(changeSecondPlayerColorButton)
        changeSecondPlayerColorButton.addEventListener("click", changeButtonColor);

    var submitPlayerSelection = document.getElementById("submitPlayerSelection");
    if(submitPlayerSelection)
        submitPlayerSelection.addEventListener("click", startGame);

    var restartGameButton = document.getElementById("restartGameButton");
    if(restartGameButton)
        restartGameButton.addEventListener("click", restartGame);
});

function changeButtonColor() {
  if(document.getElementById("changeFirstPlayerColorButton").classList.contains('white')){
    document.getElementById("changeFirstPlayerColorButton").classList.add('black');
    document.getElementById("changeFirstPlayerColorButton").classList.remove('white');

    document.getElementById("changeSecondPlayerColorButton").classList.add('white');
    document.getElementById("changeSecondPlayerColorButton").classList.remove('black');
  } else {
    document.getElementById("changeFirstPlayerColorButton").classList.add('white');
    document.getElementById("changeFirstPlayerColorButton").classList.remove('black');

    document.getElementById("changeSecondPlayerColorButton").classList.add('black');
    document.getElementById("changeSecondPlayerColorButton").classList.remove('white');
  }
}


function startGame() {
  var firstPlayerName = "";
  var secondPlayerName = "";

  if(document.getElementById("changeFirstPlayerColorButton").classList.contains('white')){
    secondPlayerName = document.getElementById("firstPlayerInput").value;
    firstPlayerName = document.getElementById("secondPlayerInput").value;
  } else {
    firstPlayerName = document.getElementById("firstPlayerInput").value;
    secondPlayerName = document.getElementById("secondPlayerInput").value;
  }
  if(firstPlayerName === "" || secondPlayerName ===""){
      alert("Bitte füllen sie alle Felder aus")
  } else {
      document.location.href = `/startGame/${firstPlayerName}/${secondPlayerName}`
  }
}

function updatePlayerStatus() {
  fetch("/playerStatus").then(response => response.text())
    .then(innerHtml => document.getElementById("turn-indicator").innerHTML = innerHtml)
    .then(()=>checkPlayerWin())
    .catch(e => console.log(e));
}

function playerWon(name) {
  let ok =confirm(`${name} hat gewonnen! Das soll das Spiel neu gestartet werden?`);
  if(ok){
    restartGame()
  }
}

function checkPlayerWin() {
  let whitePlayer =document.getElementById("whitePlayer");
  let blackPlayer =document.getElementById("blackPlayer");
  if (whitePlayer.dataset.win === "true"){
    playerWon(whitePlayer.dataset.name)
  } else if (blackPlayer.dataset.win === "true"){
    playerWon(blackPlayer.dataset.name)
  }

}

function move(oldCol, oldRow, newCol, newRow) {
  fetch(`/move/${oldCol}/${oldRow}/${newCol}/${newRow}`)
    .then(response => response.text())
    .then(boardHtml => document.getElementById("content").innerHTML = boardHtml)
    .then(() => registerOnClickListeners())
    .then(() => updatePlayerStatus())
    .catch(e => console.log(e));
}

function registerOnClickListeners() {
  var fields = document.getElementsByClassName(fieldClass);
  for (var i = 0; i < fields.length; i++) {
    fields[i].addEventListener('click', function (event) {
      event.preventDefault();
      if (event.currentTarget.classList.contains(fieldClass)) {
        let fieldElement = event.currentTarget;
        let piece = getPiece(event);
        let field = getField(fieldElement, piece);

        if (field.piece != null && lastClicked == null) {
          fieldElement.classList.add(highlightedClass);
          lastClicked = {
            element: fieldElement,
            field: field
          }
        }
        if (lastClicked != null && field.piece == null) {
          if (field.col && field.row) {
            move(lastClicked.field.col, lastClicked.field.row, field.col, field.row);
          }
          lastClicked.element.classList.remove(highlightedClass);
          lastClicked = null;
        }
      }
    }, false);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  registerOnClickListeners();
}, false);

function restartGame() {
    document.location.href='/playerSelection'
}