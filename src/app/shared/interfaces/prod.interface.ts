import { IDiscount } from "./discounts.interface";

export interface IProd{
    id:  string;
    mainTitle: string;
    mainText: string;
    urlName: string;
    descTitle: string;
    descText: string;
    aromatic: string;
    sweet: string;
    bitter: string;
    citrus:string;
    mainImg:string;
    headerImg:string;
    descImg:string;
    price: number;
    discount: any;
    count: number;
   

}