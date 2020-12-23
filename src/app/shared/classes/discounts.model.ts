import { IDiscount } from "../interfaces/discounts.interface";

export class Discount implements IDiscount {
    constructor(
        public id:  string,
        public product: string,
        public discount: number,
   
    ){}
}