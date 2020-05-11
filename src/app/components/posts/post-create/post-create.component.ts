import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PostsService } from 'src/app/service/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  title = new FormControl('', [Validators.required]);
  content = new FormControl('', [Validators.required]);
  author = new FormControl('', []);
  form: FormGroup;
  post: Post;
  imagePreview: string;
  private mode = 'create';
  private id: string;
  isLoading = false;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)],  // ADICIONAR VALIDATOR PARA MAX LENGTH AQUI
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)],
      }),
      author: new FormControl(null, {
        validators: [Validators.minLength(3), Validators.maxLength(15)],
      }),
      image: new FormControl(null, { asyncValidators: [mimeType] })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.isLoading = true;
        this.mode = 'edit';
        this.id = paramMap.get('id');
        this.postsService.getPostById(this.id).subscribe(resp => {
          this.post = {
            id: resp.id,
            title: resp.title,
            content: resp.content,
            author: resp.author,
            imagePath: resp.imagePath
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            author: this.post.author,
            image: this.post.imagePath,
          });
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }

  onAddPost() {
    this.isLoading = true;
    if (this.form.invalid) { return; }
    if (this.mode === 'create') {
      this.postsService.addPostService(
        this.form.value.title,
        this.form.value.content,
        this.form.value.author,
        this.form.value.image,
        );
      } else if (this.mode === 'edit') {
        this.postsService.editPostService(
          this.id,
          this.form.value.title,
          this.form.value.content,
          this.form.value.author,
          this.form.value.image,
          );
        }
    this.form.reset();
    this.isLoading = false;
  }

  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file
    });
    this.form.get('image').updateValueAndValidity();

    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePreview = fileReader.result as string;
    };
    fileReader.readAsDataURL(file);
  }

  getTitleError() {
    return this.title.hasError('required') ? 'Entre um Título para continuar' : '';
  }

  getContentError() {
    return this.content.hasError('required') ? 'Entre conteúdo! Dê forma as suas idéias!' : '';
  }

  // criar erro para max length do autor
}
