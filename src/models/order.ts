export default class Order {
  private _id: string;
  private createDate: Number;
  private lastModified: Number;
  // 3 Possible statuses
  // In Progress -> Order is being worked on
  // Completed -> As the name implies
  // Canceled -> Feature to be added later
  private status: String;
  // 3 Stages of Production
  // Customer -> Supplier -> Builder -> Customer
  private stage: String;
  private modelType: Number;
  constructor() {
    this._id = this.generateId();
    this.createDate = new Date().getTime();
    this.status = "In Progress";
    this.stage = "Customer";
    this.modelType = 1;
    this.lastModified = this.createDate;
  }

  private setLastModified(): void {
    this.lastModified = new Date().getTime();
  }

  /**
   * This should generally be random enough to handle a couple order ids
   * This isn't a permenant solution; it works well enough for me
   * Found on Github: https://gist.github.com/gordonbrander/2230317
   */
  private generateId(): string {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  public setStatus(status: string): void {
    this.setLastModified();
    this.status = status;
  }

  public setStage(stage: string): void {
    this.setLastModified();
    this.stage = stage;
  }

  public setModelType(type: number): void {
    this.setLastModified();
    this.modelType = type;
  }

  public toJSON(): object {
    let jsonObj = {
      "_id": this._id,
      "createDate": this.createDate,
      "status": this.status,
      "stage": this.stage,
      "modelType": this.modelType,
      "lastModified": this.lastModified
    };

    return jsonObj;
  }
}