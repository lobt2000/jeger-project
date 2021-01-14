import { Component, OnInit } from '@angular/core';
import { Drinks } from 'src/app/shared/classes/drinks.model';
import { IDrinks } from 'src/app/shared/interfaces/drinks.interface';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { DrinksService } from 'src/app/service/drinks.service';
import { BlogService } from 'src/app/service/blog.service';
import { IBlogs } from 'src/app/shared/interfaces/blogs.interface';
import { Blogs } from 'src/app/shared/classes/blogs.model';
import { element } from 'protractor';
import { IfStmt } from '@angular/compiler';
import { spawn } from 'child_process';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  isBlog = false;
  blogImg: string = '';
  blogTitle: string = '';
  blogText: any;
  blogs: Array<any> = [];
  uploadProgress: Observable<number>;
  mainImg: string;
  botImg: string;
  fullBlogs: Array<IBlogs> = [];
  mainTitle: string;
  mainText: string;
  urlName: string;
  blogsId: string;
  editStatus = false;
  transformB = 'translate3d(0,-150%,0)';
  colorB = "transparent";
  positionB = 'calc(-100%)';
  fullBlogId: any;
  editBlogStatus = false;
  textarea: string;
  selectedText: string;
  regExp;
  boldCount = 0;
  start: number;
  end: number;
  uCount = 0;
  iCount = 0;
  leftCount = 0;
  centerCount = 0;
  rightCount = 0;
  tagName: string = 'Normal';
  tag: string = 'span';
  prevTag: string = 'span';
  editorForm: FormGroup;
  editorStyle = {
    height: '300px'
  }
  config = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'align': null }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
      [{ color: ['black', 'white'] }]
    ]
  }
  snow = 'snow'
  constructor(private storage: AngularFireStorage,
    private drinkService: DrinksService,
    private blogService: BlogService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.editorForm = new FormGroup({
      'editor': new FormControl(null)
    })
    this.getBlogs();
  }

  onSubmit() {
  }

  createBlog(): void {
    this.isBlog = !this.isBlog;
    if (this.isBlog) {
      this.transformB = 'translate3d(0,0%,0)';
      this.colorB = "rgba(0, 0, 0, .7)";
      this.positionB = 'calc(0%)';
    }
    else {
      this.transformB = 'translate3d(0,-150%,0)';
      this.colorB = "transparent";
      this.positionB = 'calc(0%)';
      if (window.innerWidth < 696) {
        setTimeout(() => {
          this.positionB = 'calc(-100%)';
          this.blogImg = '';
          this.blogTitle = '';
          this.blogText = '';
        }, 1000);
      }
      else {
        setTimeout(() => {
          this.positionB = 'calc(-100%)';
          this.blogImg = '';
          this.blogTitle = '';
          this.blogText = '';
        }, 1000);
      }


    }


  }

  addBlog(): void {

    const blog = {
      title: this.blogTitle,
      text: this.editorForm.get('editor').value,
      image: this.blogImg
    }
    this.blogs.push(blog);
    this.resetBlog();


  }

  editBlog(blog: any, id: any): void {
    this.createBlog()
    this.blogsId = id;
    this.blogTitle = blog.title;
    this.editorForm.get('editor').setValue(blog.text)
    this.blogImg = blog.image
    this.editBlogStatus = true
  }


  deleteBlog(id: any): void {
    this.blogs.splice(id, 1)
  }


  saveBlog(): void {
    this.blogs[this.blogsId].title = this.blogTitle;
    this.blogs[this.blogsId].text = this.editorForm.get('editor').value;
    this.blogs[this.blogsId].image = this.blogImg;
    this.editBlogStatus = false;
    this.resetBlog();

  }

  uploadFileMain(event): void {
    const file = event.target.files[0];
    const filePath = `image/${file.name}`;
    const upload = this.storage.upload(filePath, file);
    this.uploadProgress = upload.percentageChanges();

    upload.then(image => {
      this.storage.ref(`image/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.mainImg = url;
      });
      console.log('Photo added!');
      this.toastr.success('Photo added!', 'Successed');

    });
    upload.catch(
      () =>{
      this.toastr.error('Something go wrong', 'Denied');

      }
    )
  }
  uploadFileBot(event): void {
    const file = event.target.files[0];
    const filePath = `image/${file.name}`;
    const upload = this.storage.upload(filePath, file);
    this.uploadProgress = upload.percentageChanges();

    upload.then(image => {
      this.storage.ref(`image/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.botImg = url
      });
      console.log('Photo added!');
      this.toastr.success('Photo added!', 'Successed');

    });
    upload.catch(
      () =>{
      this.toastr.error('Something go wrong', 'Denied');

      }
    )
  }
  uploadFileBlog(event): void {
    const file = event.target.files[0];
    const filePath = `image/${file.name}`;
    const upload = this.storage.upload(filePath, file);
    this.uploadProgress = upload.percentageChanges();

    upload.then(image => {
      this.storage.ref(`image/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.blogImg = url
      });
      console.log('Photo added!');
      this.toastr.success('Photo added!', 'Successed');

    });
    upload.catch(
      () =>{
      this.toastr.error('Something go wrong', 'Denied');

      }
    )
  }



  getBlogs(): void {
    this.blogService.getAllBlogs().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.fullBlogs = data;

    });

  }

  addFullBlog(): void {
    if (this.mainText && this.mainTitle && this.blogs && this.urlName) {
      const newBlog = new Blogs('1',
        this.mainTitle,
        this.mainText,
        this.urlName,
        this.blogs,
        this.mainImg,
        this.botImg)
      delete newBlog.id;
      this.blogService.create(newBlog)
      this.blogService.updProd.subscribe(
        data => {

          newBlog.id = data
          this.blogService.update(data, newBlog).then(
            () => {
              this.getBlogs();
            }
          )
        }
      )
      this.toastr.success('Blog add', 'Successed');

      this.resetForm()
    }
    else {
      this.resetForm()
    }

  }
  deleteFullBlog(blog: IBlogs): void {

    this.blogService.delete(blog.id.toString())
      .then(() => {
        this.toastr.success('Blog delete', 'Successed');
        this.getBlogs()
      })
      .catch(err => {
        this.toastr.error('Something go wrong', 'Denied');
      });
  }
  editFullBlog(blog: IBlogs): void {
    this.fullBlogId = blog.id;
    this.mainTitle = blog.mainTitle;
    this.mainText = blog.mainText;
    this.urlName = blog.urlName;
    this.blogs = blog.blogs;
    this.mainImg = blog.mainImg;
    this.botImg = blog.botImg;
    this.editStatus = true;

  }
  saveFullBlog(): void {
    const saveB = new Blogs('1', this.mainTitle, this.mainText, this.urlName, this.blogs, this.mainImg, this.botImg)
    saveB.id = this.fullBlogId;
    this.blogService.update(saveB.id.toString(), saveB)
      .then(() => {
        this.toastr.success('Blog update', 'Successed');
        this.getBlogs()
      })
      .catch(err => {
        this.toastr.error('Something go wrong', 'Denied');
      });
    this.resetForm();
    this.editStatus = false;
  }
  resetForm() {
    this.mainText = '';
    this.mainTitle = '';
    this.blogs = [];
    this.mainImg = '';
    this.urlName = '';
    this.blogText = '';
    this.blogTitle = '';
    this.textarea = '';
    this.botImg = '';
    this.editorForm.get('editor').setValue('');
  }
  resetBlog(): void {
    this.blogText = '';
    this.blogTitle = '';
    this.textarea = '';
    this.botImg = '';
    this.editorForm.get('editor').setValue('')

  }
 
}
