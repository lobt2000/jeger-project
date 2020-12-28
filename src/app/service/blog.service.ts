import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { IBlogs } from '../shared/interfaces/blogs.interface';
import { IDrinks } from '../shared/interfaces/drinks.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private dbPath = '/blogs';
  prod: Subject<any> = new Subject<any>();
  updProd: Subject<any> = new Subject<any>();
  blogsRef: AngularFirestoreCollection<IBlogs> = null;
  constructor(private db: AngularFirestore) {
    this.blogsRef = this.db.collection(this.dbPath);
  }

  getAllBlogs(): AngularFirestoreCollection<IBlogs> {
    return this.blogsRef;


  }
  create(blog: IBlogs): any {
    this.blogsRef.add({ ...blog }).then(
      data => {
        this.updProd.next(data.id);

      }
    );
  }
  update(id: string, data: any): Promise<void> {
    return this.blogsRef.doc(id).update({ ...data });
  }
  delete(id: string): Promise<void> {
    return this.blogsRef.doc(id).delete();
  }
  getOne(id): any {
    return this.blogsRef.ref.where('urlName', '==', id);

  }
}
