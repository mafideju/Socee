import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    this.http
      .get<{message: string, posts: any}>(`http://localhost:3000/api/posts`)
      .pipe(map(data => {
        return data.posts.map(post => {
          return {
            id: post._id,
            title: post.title,
            content: post.content
          }
        });
      }))
      .subscribe(data => {
        this.posts = data;
        this.postsUpdated.next(this.posts);
    });
  }

  getPostById(id: string) {
    return { ...this.posts.find(post => post.id === id) };
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(id: null, title: string, content: string) {
    const post: Post = {id, title, content};
    this.http.post<{message: string, postId: string}>(`http://localhost:3000/api/posts`, post)
      .subscribe(data => {
        post.id = data.postId;
        this.posts.unshift(post);
        this.postsUpdated.next([...this.posts]);
    });
  }

  editPost(id: string, title: string, content: string) {
    const post: Post = {id, title, content};
    this.http.put(`http://localhost:3000/api/posts/${id}`, post)
    .subscribe(resp => console.log(resp));
  }

  deletePostService(postId: string) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        const updatedPost = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPost;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
