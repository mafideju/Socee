import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { PostsService } from 'src/app/service/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  title = new FormControl('', [Validators.required]);
  content = new FormControl('', [Validators.required]);
  private mode = 'create';
  private id: string;
  post: Post;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      // this.mode = paramMap.has('id') ? 'edit' : 'create';
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.id = paramMap.get('id');
        this.post = this.postsService.getPostById(this.id);
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }

  onAddPost(form: NgForm) {
    if (form.invalid) { return; }
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.id, form.value.title, form.value.content);
    } else if (this.mode === 'edit') {
      this.postsService.editPost(this.id, form.value.title, form.value.content);
    }
    form.resetForm();
  }

  getTitleError() {
    return this.title.hasError('required') ? 'Entre um Título para continuar' : '';
  }

  getContentError() {
    return this.content.hasError('required') ? 'Entre conteúdo! Dê forma as suas idéias!' : '';
  }
}
