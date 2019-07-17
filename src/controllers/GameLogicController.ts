/**
 * Controller handles all of the game logic
 * i.e. Things that deal with the orders
 */

import {CustOrderDatabaseConnector} from '../models/CustOrderDatabaseConnector';
import {OrderImage} from "../models/orderImage";
import {ICustomerOrder} from "../models/customerOrderSchema";
import DatabaseConnector from "../models/database";
import {SupplierOrderDatabaseConnector} from "../models/SupplierOrderDatabaseConnector";
import {ISupplierOrder, PartInventory} from "../models/supplierOrderSchema";

export class GameLogicController {
  private custOrderDBConnector: CustOrderDatabaseConnector;
  private supplierOrderDBConnector: SupplierOrderDatabaseConnector;

  constructor(dbClient: DatabaseConnector) {
    this.custOrderDBConnector = new CustOrderDatabaseConnector(dbClient);
    this.supplierOrderDBConnector = new SupplierOrderDatabaseConnector(dbClient);
  }

  public async placeOrder(pin: number, modelID: number): Promise<void> {
    let order = {pin: pin, modelID: modelID};
    await this.custOrderDBConnector.addOrder(order);
  }

  public async placeCustomOrder(pin: number, orderDesc: string, imageData: Buffer): Promise<void>
  {
    let order = {pin: pin, isCustomOrder: true, orderDesc: orderDesc, imageData: await (new OrderImage(imageData)).toBuffer()};
    await this.custOrderDBConnector.addOrder(order);
  }

  /*
  private generateOrders(pin: number, max:number, skew: number): void {
    for (let i: number = 0; i < max; i++) {
      let order = new Order(pin);
      let ID: number = Math.ceil(this.normalDistribution(skew));
      order.setModelID(ID);
      order.setStage('Manufacturer');
      this.db.addOrder(order.toJSON());
    }
  }
  */

  /**
   * Found on StackOverflow
   * https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
   * @param min 
   * @param max 
   * @param skew 
   */
/*  private normalDistribution(skew: number): number {
    const min: number = 0;
    const max: number = 4;
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = this.normalDistribution(skew); // resample between 0 and 1 if out of range
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
  }*/

  public async getOrder(pin: string, orderID: string): Promise<ICustomerOrder | null>
  {
    return await this.custOrderDBConnector.getOrder(pin, orderID);
  }

  public async getOrders(pin: string): Promise<Array<object>> {
    return await this.custOrderDBConnector.getOrders(pin);
  }

  public async getCustomOrderImage(pin: string, orderID: string): Promise<Buffer>
  {
    return await this.custOrderDBConnector.getCustomOrderImage(pin, orderID);
  }

  public async completeSupplyOrder(pin: string, orderId: string, parts: Array<PartInventory>): Promise<ISupplierOrder | null> {
    return this.supplierOrderDBConnector.completeOrder(pin, orderId, parts);
  }

  public async getSupplyOrder(pin: string, orderId: string): Promise<Array<PartInventory>> {
    return await this.supplierOrderDBConnector.getSupplyOrder(pin, orderId);
  }

  /*public async getColors(pin: string, orderId: string): Promise<Array<any>> {
    let result = await this.custOrderDBConnector.getColors(pin, orderId);
    return result;
  }*/

  public updatePieces(pin: string, orderId: string, pieces: Array<number>): number {
    return this.custOrderDBConnector.updatePieces(pin, orderId, pieces);
  }

  public updateAssembledModel(pin: string, orderId: string, model: string): number {
    return this.custOrderDBConnector.updateAssembledModel(pin, orderId, model);
  }

  public async getAssembledModel(pin: string, orderId: string): Promise<string> {
    return await this.custOrderDBConnector.getAssembledModel(pin, orderId);
  }

  public async getManufacturerRequest(pin: number, orderId: string): Promise<Array<PartInventory>> {
    return await this.supplierOrderDBConnector.getManufacturerRequest(pin, orderId);
  }

  public addSupplyOrder(pin: string, request: Array<PartInventory>): Promise<ISupplierOrder> {
    return this.supplierOrderDBConnector.addOrder(pin, request);
  }

  public acceptOrder(pin: string, orderId: string): number {
    return this.custOrderDBConnector.acceptOrder(pin, orderId);
  }

  public rejectOrder(pin: string, orderId: string): number {
    return this.custOrderDBConnector.rejectOrder(pin, orderId);
  }
}