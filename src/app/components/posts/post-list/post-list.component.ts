import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/service/posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
// import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})

export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  panelOpenState = false;
  isLoading = false;
  pageSize = 5;
  totalPosts = 50;
  currentPage = 1;

  private postsSubscription: Subscription;

  constructor(public postsService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.postsSubscription = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
  }

  deletePost(id: string) {
    this.postsService.deletePostService(id);
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.postsService.getPosts(this.pageSize, 1);
    this.isLoading = false;
  }
}
