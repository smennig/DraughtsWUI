package controllers


import de.htwg.draughts.controller.{GameController, MoveController}
import de.htwg.draughts.model.{Board, BoardCreator, Colour, Player}
import javax.inject._
import play.api.mvc._


/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class DraughtsController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  var c: GameController = _

  var winPlayer : Option[Player] = Option.empty


  def index = Action {
    Ok(views.html.player_selection())
  }

  def move(oldCol: Int, oldRow: Int, newCol: Int, newRow: Int) = Action {

    val result=c.move(oldCol, oldRow, newCol, newRow)
    winPlayer =result._2
    Ok(views.html.board_fragment(c))
  }

  def startGame(firstPlayerName: String, secondPlayerName: String) = Action {
    val  createdPlayerOne = new Player(name = firstPlayerName, color = Colour.BLACK, turn = true)
    val  createdPlayerTwo = new Player(name = secondPlayerName, color = Colour.WHITE, turn = false)

    val  b = new BoardCreator(8).setupFields()
    c = new MoveController(b, createdPlayerOne, createdPlayerTwo)
    Ok(views.html.board(c))
  }

  def playerStatus()= Action{
    Ok(views.html.player_status(c, winPlayer))
  }

  def selectPlayers()= Action{
    Ok(views.html.player_selection())
  }

}
