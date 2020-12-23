import { IBlogs } from "../interfaces/blogs.interface";

export class Blogs implements IBlogs {
    constructor(
        public id:  string,
        public mainTitle: string,
        public mainText: string,
        public urlName: string,
        public blogs: Array<any> = [],
        public mainImg:string,
        public botImg:string,
    ){}
}