import { IDrinks } from "../interfaces/drinks.interface";

export class Drinks implements IDrinks {
    constructor(
        public id:  string,
        public name: string,
        public urlName: string,
        public ingredients: Array<any> = [], 
        public stepOfCook: Array<any> = [], 
        public image:string,
    ){}
}