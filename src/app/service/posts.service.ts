import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>(`http://localhost:3000/api/posts`).subscribe(data => {
      this.posts = data.posts;
      this.postsUpdated.next([...this.posts]);
      console.log('post', data.posts);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(id: null, title: string, content: string) {
    const post: Post = {id, title, content};
    this.http.post<{message: string}>(`http://localhost:3000/api/posts`, post).subscribe(data => {
      console.log('DATA', data);
      
      this.posts.unshift(post);
      this.postsUpdated.next([...this.posts]);
    });
  }
}
