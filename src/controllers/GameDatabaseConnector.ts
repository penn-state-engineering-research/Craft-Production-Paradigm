/**
 * This class handles all of the Game Settings
 * and anything involved with starting or joining games
 */

import * as mongoose from 'mongoose';
import Database from './database';

export class GameDatabaseConnector extends Database {
  constructor() {
    super();
  }

  /**
   * This takes the passed in game object and adds it to the database
   * @param game Scheme created earlier
   */
  public addToDatabase(game: mongoose.Model<any>): void {
    this.gameCollection.insert(game);
  }

  /**
   * Returns whether or not a pin already exists
   * This is to avoid games from having the same pin
   * @param pin Identifier
   */
  public async checkIfPinExists(pinNum: string): Promise<any> {
    let result = await this.gameCollection.findOne({pin: parseInt(pinNum)})
    return result != undefined && result != null;
  }

  /**
   * Increments the active players by one whenever a new player joins the game
   * @param pinNum string
   */
  public addActivePlayer(pinNum: string): void {
    this.gameCollection.update({pin: parseInt(pinNum)}, {$inc: {activePlayers: 1}});
  }

  /**
   * When someone needs to exit the application, this handles removing the active player
   * it will also delete the database entry, if there are no active players
   * @param pinNum string
   */
  public removeActivePlayer(pinNum: string, position: string): void {
    let query = {pin: parseInt(pinNum)};
    let change = {$inc: {activePlayers: -1}, $pull: {positions: position}}
    this.gameCollection.update(query, change);
    this.gameCollection.findOne(query, (err: any, result: any) => {
      if (err) console.log(err);
      if (result.activePlayers <= 0) this.gameCollection.deleteOne(query);
    });
  }

  /**
   * Used for when looking up the game by pin
   * @param pinNum string
   */
  public async getGameObject(pinNum: string): Promise<any> { 
    try {
      return await this.gameCollection.find({pin: parseInt(pinNum)}).toArray();
    } catch(e) {
      return null;
    }
  }

  /**
   * Makes sure two users don't end up with the same positions
   * If no positions are returned, the game is full
   * @param pinNum string 
   */
  public async getPossiblePositions(pinNum: string): Promise<any> {
    return await this.gameCollection.findOne({pin: parseInt(pinNum)}, {fields: {positions: 1}});
  }

  public joinGame(pinNum: string, position: string): void {
    if (position != null && position != "" && position != undefined)
      this.gameCollection.update({pin: parseInt(pinNum)}, {$push: {positions: position}});
  }
}