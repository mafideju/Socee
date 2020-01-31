import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  @Output() postCreated: EventEmitter<any> = new EventEmitter();
  enteredTitle = '';
  enteredContent = '';

  constructor() { }

  ngOnInit() {
  }

  onAddPost() {
    const newPost = {
      title: this.enteredTitle,
      content: this.enteredContent
    };
    this.postCreated.emit(newPost);
  }
}
