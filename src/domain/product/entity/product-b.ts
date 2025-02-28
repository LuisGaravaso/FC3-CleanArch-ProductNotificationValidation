import Entity from "../../@shared/entity/entity.abstract";
import NotificationError from "../../@shared/notification/notification.error";
import ProductBValidatorFactory from "../factory/product-b.validator.factory";
import ProductInterface from "./product.interface";

export default class ProductB extends Entity implements ProductInterface{
  protected _id: string;
  private _name: string;
  private _price: number;

  constructor(id: string, name: string, price: number) {
    super();
    this._id = id;
    this._name = name;
    this._price = price;
    this.validate();
    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors());
    }
  }

  get id(): string {
    return this._id;
  }
  
  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price * 2;
  }

  changeName(name: string): void {
    this._name = name;
    this.validate();
  }

  changePrice(price: number): void {
    this._price = price;
    this.validate();
  }

  validate() {
    ProductBValidatorFactory.create().validate(this);
  }
}
