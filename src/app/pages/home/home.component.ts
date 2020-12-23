import { Component, HostListener, OnInit } from '@angular/core';
import AOS from 'aos'
import { BlogService } from 'src/app/service/blog.service';
import { IBlogs } from 'src/app/shared/interfaces/blogs.interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  blogs: Array<IBlogs> = []
  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    AOS.init();
    this.getBlogs();
    // window.screenY = 0;
  }
  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    let scroll = window.scrollY;
    
  }
  getBlogs() {
    this.blogService.getAllBlogs().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.blogs = data;
      console.log(data);


    });
  }

}
