import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/service/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})

export class PostListComponent implements OnInit {
  panelOpenState = false;
  posts: Post[] = [];
  private postsSubscription: Subscription;

  constructor(public postsService: PostsService) { }

  ngOnInit() {
    this.posts = this.postsService.getPosts();
    this.postsSubscription =  this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
      console.log(posts);
    });
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
  }
}
