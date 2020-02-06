import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { PostsService } from 'src/app/service/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  title = new FormControl('', [Validators.required]);
  content = new FormControl('', [Validators.required]);

  constructor(public postsService: PostsService) { }

  ngOnInit() {
  }

  onAddPost(form: NgForm) {
    if (form.invalid) { return; }
    this.postsService.addPost(form.value.id, form.value.title, form.value.content);
    form.resetForm();
  }

  getTitleError() {
    return this.title.hasError('required') ? 'Entre um Título para continuar' : '';
  }

  getContentError() {
    return this.content.hasError('required') ? 'Entre conteúdo! Dê forma as suas idéias!' : '';
  }
}
