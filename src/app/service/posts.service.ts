import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(
    private http: HttpClient,
    private router: Router
    ) { }

  getPosts() {
    this.http
      .get<{message: string, posts: any}>(`http://localhost:3000/api/posts`)
      .pipe(map(data => {
        return data.posts.map(post => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
            author:  post.author,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe(data => {
        this.posts = data;
        this.postsUpdated.next(this.posts);
    });
  }

  getPostById(id: string) {
    return this.http.get<{
      id: string,
      title: string,
      content: string,
      author: string,
      imagePath: string
    }>(`http://localhost:3000/api/posts/${id}`);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPostService(title: string, content: string, author: string, image: File) {

    const post = new FormData();
    post.append('title', title);
    post.append('content', content);
    post.append('author', author);
    post.append('image', image, title);


    this.http
    .post<{message: string, post: Post}>(`http://localhost:3000/api/posts`, post)
    .subscribe(resp => {
      const postPost: Post = { id: resp.post.id, title, content, author, imagePath: resp.post.imagePath };
      this.posts.unshift(postPost);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  editPostService(id: string, title: string, content: string, author: string, image: File | string) {
    let post: Post | FormData;

    if (typeof(image) === 'object') {
      post = new FormData();
      post.append('id', id);
      post.append('title', title);
      post.append('content', content);
      post.append('author', author);
      post.append('image', image, title);
    } else {
      post = {id, title, content, author, imagePath: image};
    }

    this.http
    .put(`http://localhost:3000/api/posts/${id}`, post)
    .subscribe(resp => {
      const currentPost = [...this.posts];
      const oldPostIndex = currentPost.findIndex(actualPost => actualPost.id === id);
      const newPost: Post = {id, title, content, author, imagePath: image as string};
      currentPost[oldPostIndex] = newPost;
      this.posts = currentPost;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePostService(id: string) {
    this.http.delete(`http://localhost:3000/api/posts/${id}`)
      .subscribe(() => {
        const updatedPost = this.posts.filter(post => post.id !== id);
        this.posts = updatedPost;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
