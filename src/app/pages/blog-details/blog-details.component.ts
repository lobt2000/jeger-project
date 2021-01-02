import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'src/app/service/blog.service';
import { IBlogs } from 'src/app/shared/interfaces/blogs.interface';
import AOS from 'aos';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {
  blog;
  width: number;
  constructor(private blogService: BlogService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getBlog();
    window.scrollTo(0, 0);

    this.style();
    AOS.init();
  }



  private getBlog(): void {
    const name = this.activatedRoute.snapshot.paramMap.get('name');
    this.blogService.getOne(name).onSnapshot(
      document => {
        document.forEach(prod => {
          const blog = {
            id: prod.id,
            ...prod.data() as IBlogs
          };
          this.blog = blog;


        });
      }
    );
  }

  style() {
    document.getElementById('blog').style.background = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%,rgba(0, 0, 0, 0.8) 20%,rgba(0, 0, 0, .9) 50%,rgba(0, 0, 0, 1) 100%)';
  }
}