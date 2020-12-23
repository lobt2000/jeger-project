import { IDiscount } from "../interfaces/discounts.interface";
import { IProd } from "../interfaces/prod.interface";

export class Prod implements IProd {
    constructor(
        public id:  string,
        public mainTitle: string,
        public mainText: string,
        public urlName: string,
        public descTitle: string,
        public descText: string,
        public aromatic: string,
        public sweet: string,
        public bitter: string,
        public citrus: string,
        public mainImg:string,
        public headerImg:string,
        public descImg:string,
        public price: number,
        public discount = {},

        public count: number = 1
    ){}
}