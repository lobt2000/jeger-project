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

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  isBlog = false;
  blogImg: string = '';
  blogTitle: string = '';
  blogText: any ;
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
  // Count = 0;
  tagName: string = 'Normal';
  tag: string = 'span';
  prevTag: string = 'span';

  constructor(private storage: AngularFireStorage,
    private drinkService: DrinksService,
    private blogService: BlogService) { }

  ngOnInit(): void {

    this.getBlogs();
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
      text: this.textarea,
      image: this.blogImg
    }
    this.blogs.push(blog);


    // document.querySelector('.textBox').innerHTML = blog.text 
    // document.querySelector('.textBox').innerHTML = blog.text 
    this.resetBlog();


  }

  editBlog(blog: any, id: any): void {
    this.createBlog()
    this.blogsId = id;
    this.blogTitle = blog.title;
    this.textarea = blog.text;
    console.log(this.textarea);

    this.blogImg = blog.image
    this.editBlogStatus = true
  }


  deleteBlog(id: any): void {
    this.blogs.splice(id, 1)
  }


  saveBlog(): void {
    this.blogs[this.blogsId].title = this.blogTitle;
    this.blogs[this.blogsId].text = this.textarea;
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

    });
  }
  uploadFileBot(event): void {
    const file = event.target.files[0];
    const filePath = `image/${file.name}`;
    const upload = this.storage.upload(filePath, file);
    this.uploadProgress = upload.percentageChanges();

    upload.then(image => {
      this.storage.ref(`image/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        console.log(url);

        this.botImg = url
      });
      console.log('Photo added!');

    });
  }
  uploadFileBlog(event): void {
    const file = event.target.files[0];
    const filePath = `image/${file.name}`;
    const upload = this.storage.upload(filePath, file);
    this.uploadProgress = upload.percentageChanges();

    upload.then(image => {
      this.storage.ref(`image/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        console.log(url);

        this.blogImg = url
      });
      console.log('Photo added!');

    });
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
          console.log(data);
          newBlog.id = data
          this.blogService.update(data, newBlog).then(
            () => {
              this.getBlogs();
            }
          )
        }
      )
      // this.toastr.success('Product add', 'Successed');

      this.resetForm()
    }
    else {
      this.resetForm()
    }

  }
  deleteFullBlog(blog: IBlogs): void {

    this.blogService.delete(blog.id.toString())
      .then(() => {
        // this.toastr.success('Product delete', 'Successed');
        this.getBlogs()
      })
      .catch(err => {
        // this.toastr.error('Something go wrong', 'Denied');
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
        // this.toastr.success('Product update', 'Successed');
        this.getBlogs()
      })
      .catch(err => {
        // this.toastr.error('Something go wrong', 'Denied');
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
    // this.success = false;
    // this.procent = true;
  }
  resetBlog(): void {
    this.blogText = '';
    this.blogTitle = '';
    this.textarea = '';
    this.botImg = '';
  }
  bold(): void {
    if (this.textarea) {
      if (this.boldCount == 0) {
        this.setStyle('<b>', `</b>`)
        this.boldCount++
      }
      else {
        this.removeStyle('<b>', `</b>`);
        this.boldCount = 0
      }
    }
  }
  underline(): void {
    if (this.textarea) {

      if (this.uCount == 0) {
        this.setStyle('<u>', `</u>`)
        this.uCount++
      }
      else {
        this.removeStyle('<u>', `</u>`);
        this.uCount = 0
      }
    }
  }
  italic(): void {
    if (this.textarea) {

      if (this.iCount == 0) {
        this.setStyle('<i>', `</i>`)
        this.uCount++
      }
      else {
        this.removeStyle('<i>', `</i>`);
        this.uCount = 0
      }
    }

  }
  left(): void {
    if (this.textarea) {

      if (this.leftCount == 0) {
        if (this.selectedText) {
          this.regExp = new RegExp(`\\b${this.selectedText}\\b`, 'gi');
          this.textarea = this.textarea.replace(this.regExp, `<span style="text-align: left">${this.selectedText}</span>`);

        }
        else {
          this.textarea = `<${this.tag} style="text-align: left">${this.textarea}</${this.tag}>`;
          console.log(this.textarea);

        }
        this.leftCount++
      }
      else {
        this.removeStyle('<span style="text-align: left">', `</span>`);
        if (this.selectedText) {
          this.regExp = new RegExp(`<span style="text-align: left">`);
          this.blogText = this.selectedText.replace(this.regExp, '');
          this.regExp = new RegExp(`</span>`);
          this.blogText = this.blogText.replace(this.regExp, '');
          this.regExp = new RegExp(this.selectedText, 'gi');
          this.textarea = this.textarea.replace(this.regExp, `${this.blogText}`);
          console.log(this.blogText);
        }
        else {
          this.regExp = new RegExp(`<${this.tag} style="text-align: left">`);
          this.blogText = this.textarea.replace(this.regExp, '');
          this.regExp = new RegExp(`</${this.tag}>`);
          this.blogText = this.blogText.replace(this.regExp, '');
          this.textarea = this.blogText;
          console.log(this.blogText);

        }
        this.leftCount = 0
      }
    }
  }
  center(): void {
    if (this.textarea) {

      if (this.centerCount == 0) {
        this.setStyle('<span style="text-align: center">', `</span>`)
        this.centerCount++
      }
      else {
        this.removeStyle('<span style="text-align: center">', `</span>`);
        this.centerCount = 0
      }
    }

  }
  right(): void {
    if (this.textarea) {

      if (this.rightCount == 0) {
        this.setStyle('<span style="text-align: right">', `</span>`)
        this.rightCount++
      }
      else {
        this.removeStyle('<span style="text-align: right">', `</span>`);
        this.rightCount = 0
      }
    }

  }
  select(): void {
    if (this.textarea) {
      if (this.selectedText) {
        console.log('It isnt work with selected text');

      }
      else {
        if (this.tagName == 'Heading 1') {
          this.tag = 'h1';
          this.regExp = new RegExp(`<${this.prevTag}>`);
          this.blogText = this.textarea.replace(this.regExp, '');
          this.regExp = new RegExp(`</${this.prevTag}>`);
          this.blogText = this.blogText.replace(this.regExp, '');
          this.textarea = this.blogText;
          this.textarea = `<${this.tag}>${this.textarea}</${this.tag}>`;
          this.prevTag = this.tag

        }
        else if (this.tagName == 'Heading 2') {
          this.tag = 'h2';
          this.regExp = new RegExp(`<${this.prevTag}>`);
          this.blogText = this.textarea.replace(this.regExp, '');
          this.regExp = new RegExp(`</${this.prevTag}>`);
          this.blogText = this.blogText.replace(this.regExp, '');
          this.textarea = this.blogText;
          this.textarea = `<${this.tag}>${this.textarea}</${this.tag}>`;
          this.prevTag = this.tag

        }
        else {
          this.tag = 'span';
          this.regExp = new RegExp(`<${this.prevTag}>`);
          this.blogText = this.textarea.replace(this.regExp, '');
          this.regExp = new RegExp(`</${this.prevTag}>`);
          this.blogText = this.blogText.replace(this.regExp, '');
          this.textarea = this.blogText;
          this.textarea = `<${this.tag}>${this.textarea}</${this.tag}>`;
          this.prevTag = this.tag

        }
      }

    }
  }

  getSelectedText(): void {
    // let selectedText;
    this.selectedText = window.getSelection().toString();
    console.log(this.selectedText);

  }

  setStyle(openTag: string, closeTag: string): void {
    if (this.selectedText) {
      this.regExp = new RegExp(`\\b${this.selectedText}\\b`, 'gi');
      this.textarea = this.textarea.replace(this.regExp, `${openTag}${this.selectedText}${closeTag}`);

    }
    else {
      this.textarea = `${openTag}${this.textarea}${closeTag}`;
      console.log(this.textarea);

    }
  }
  removeStyle(openTag: string, closeTag: string): void {
    if (this.selectedText) {
      this.regExp = new RegExp(`${openTag}`);
      this.blogText = this.selectedText.replace(this.regExp, '');
      this.regExp = new RegExp(`${closeTag}`);
      this.blogText = this.blogText.replace(this.regExp, '');
      this.regExp = new RegExp(this.selectedText, 'gi');
      this.textarea = this.textarea.replace(this.regExp, `${this.blogText}`);
      console.log(this.blogText);
    }
    else {
      this.regExp = new RegExp(`${openTag}`);
      this.blogText = this.textarea.replace(this.regExp, '');
      this.regExp = new RegExp(`${closeTag}`);
      this.blogText = this.blogText.replace(this.regExp, '');
      this.textarea = this.blogText;
      console.log(this.blogText);

    }
  }
}
