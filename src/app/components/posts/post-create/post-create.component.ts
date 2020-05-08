import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
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
  author = new FormControl('', [Validators.required]);
  post: Post;
  private mode = 'create';
  private id: string;
  isLoading = false;
  form: FormGroup;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)],
      }),
      author: new FormControl(null, {
        validators: [Validators.minLength(3), Validators.maxLength(15)],
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.isLoading = true;
        this.mode = 'edit';
        this.id = paramMap.get('id');
        this.postsService.getPostById(this.id).subscribe(resp => {
          this.post = { id: resp._id, title: resp.title, content: resp.content, author: resp.author };
          this.isLoading = false;
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            author: this.post.author
          });
        });
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }

  onAddPost() {
    if (this.form.invalid) { return; }
    if (this.mode === 'create') {
      this.isLoading = true;
      this.postsService.addPostService(
          this.form.value.id,
          this.form.value.title,
          this.form.value.content,
          this.form.value.author
        );
    } else if (this.mode === 'edit') {
      this.postsService.editPostService(
        this.id,
        this.form.value.title,
        this.form.value.content,
        this.form.value.author
      );
    }
    this.form.reset();
    this.isLoading = false;
  }

  getTitleError() {
    return this.title.hasError('required') ? 'Entre um Título para continuar' : '';
  }

  getContentError() {
    return this.content.hasError('required') ? 'Entre conteúdo! Dê forma as suas idéias!' : '';
  }
}
