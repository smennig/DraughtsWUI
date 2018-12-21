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

function move(oldCol, oldRow, newCol, newRow) {
    fetch(`/move/${oldCol}/${oldRow}/${newCol}/${newRow}`)
      .then(response => response.text())
      .then(boardHtml => document.getElementById("content").innerHTML = boardHtml)
      .then(() => registerOnClickListeners())
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
  registerOnClickListeners()
}, false);
