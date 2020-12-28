import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private dbPath = '/comments';
  commentsRef: AngularFirestoreCollection<any> = null;
  constructor( private db: AngularFirestore) {
    this.commentsRef = this.db.collection(this.dbPath);
  }


  create(comm: any): Promise<DocumentReference<any>> {
    return this.commentsRef.add({ ...comm });
  }

}
