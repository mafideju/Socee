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
  post: Post;
  private mode = 'create';
  private id: string;
  isLoading = false;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.isLoading = true;
        this.mode = 'edit';
        this.id = paramMap.get('id');
        this.postsService.getPostById(this.id).subscribe(resp => {
          this.post = { id: resp._id, title: resp.title, content: resp.content };
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }

  onAddPost(form: NgForm) {
    if (form.invalid) { return; }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPostService(form.value.id, form.value.title, form.value.content);
      this.isLoading = false;
    } else if (this.mode === 'edit') {
      this.postsService.editPostService(this.id, form.value.title, form.value.content);
      this.isLoading = false;
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
