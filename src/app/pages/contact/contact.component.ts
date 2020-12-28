import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
  regExpEmail = /^[a-z0-9\-\.]{1,}@gmail\.com|net\.us|org\.ua$/i;
  regExpFname = /^[a-z]{2,}$/i;
  regExpSname = /^[a-z]{2,}$/i;
  commentEmail: string = '';
  commentFname: string = '';
  commentSname: string = '';
  comment: string = '';
  constructor(private commService: CommentService, private toastr: ToastrService) { }

  ngOnInit(): void {
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
          sname: this.commentSname
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
