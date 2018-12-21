package controllers

import de.htwg.draughts.controller._
import de.htwg.draughts.model.{Board, BoardCreator}
import javax.inject._
import play.api.mvc._


/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class DraughtsController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val board: Board = new BoardCreator(8).setupFields()
  val c: GameController = new MoveController(board)

  /**
    * Create an Action to render an HTML page with a welcome message.
    * The configuration in the `routes` file means that this method
    * will be called when the application receives a `GET` request with
    * a path of `/`.
    */
  def index = Action {
    Ok(views.html.board(c))
  }


  def move(oldCol: Int, oldRow: Int, newCol: Int, newRow: Int) = Action {

    //FIXME switch col and row
    println(c.move(oldCol, oldRow, newCol, newRow))
    println((oldCol, oldRow, newCol, newRow))
    println(c.board)
    Ok(views.html.board_fragment(c))
  }

}
