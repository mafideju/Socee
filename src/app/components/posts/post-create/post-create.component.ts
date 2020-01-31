import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  title = new FormControl('', [Validators.required, Validators.email]);

  @Output() postCreated: EventEmitter<Post> = new EventEmitter();
  enteredTitle: string;
  enteredContent: string;

  constructor() { }

  ngOnInit() {
  }

  onAddPost() {
    const newPost: Post = {
      title: this.enteredTitle,
      content: this.enteredContent
    };
    this.postCreated.emit(newPost);
  }

  getErrorMessage() {
    return this.enteredTitle.hasError('required') ? 'You must enter a value' :
        this.enteredTitle.hasError('email') ? 'Not a valid email' :
            '';
  }
}
