import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { CommentService } from 'src/app/service/comment.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  myclick = false;
  angle = '../../../assets/image/angle-down-solid.svg';
  height = '0px';
  myclick1 = false;
  angle1 = '../../../assets/image/angle-down-solid.svg';
  height1 = '0px';
  regExpEmail = /^[a-z0-9\-\.]{1,}@gmail\.com|net\.us|org\.ua$/i;
  regExpFname = /^[a-z]{2,}$/i;
  regExpSname = /^[a-z]{2,}$/i;
  commentEmail: string = '';
  commentFname: string = '';
  commentSname: string = '';
  comment: string = '';
  comments: Array<string> = [];
  constructor(private commService: CommentService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getComments();
    window.scrollTo(0, 0);

  }

  getComments(): void {
    this.commService.getAllComm().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.comments = data;
      console.log(this.comments);
      
    });

  }

  selectClick(): void {
    this.myclick = !this.myclick;
    if (this.myclick) {
      this.angle = '../../../assets/image/angle-up-solid.svg';
      this.height = '750px';


    }
    else {
      this.angle = '../../../assets/image/angle-down-solid.svg';
      this.height = '0px';

    }
  }
  selectClick1(): void {
    this.myclick1 = !this.myclick1;
    if (this.myclick1) {
      this.angle1 = '../../../assets/image/angle-up-solid.svg';
      this.height1 = 'auto';


    }
    else {
      this.angle1 = '../../../assets/image/angle-down-solid.svg';
      this.height1 = '0px';

    }
  }


  regCheckEmail(): boolean {
    return this.regExpEmail.test(this.commentEmail);

  }
  regCheckFname(): boolean {
    return this.regExpFname.test(this.commentFname);

  }
  regCheckSname(): boolean {
    return this.regExpSname.test(this.commentSname);

  }
  save(): void {

    if (this.regCheckEmail() && this.regCheckFname && this.regCheckSname) {
      if (this.comment) {
        const comm = {
          email: this.commentEmail,
          fname: this.commentFname,
          sname: this.commentSname,
          comment: this.comment
        }
        this.commService.create(comm).then(
          () => {
            this.resetForm();
            this.toastr.success('Thanks for your comment!', 'Success');

          }
        )


      }
      else {
        this.resetForm();
        this.toastr.error('Something go wrong', 'Denied');


      }
    }
    else {
      this.resetForm();
      this.toastr.error('Something go wrong', 'Denied');


    }
  }
  resetForm(): void {
    this.commentEmail = '';
    this.commentFname = '';
    this.commentSname = '';
    this.comment = '';
  }


}
