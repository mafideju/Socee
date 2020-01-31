import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  panelOpenState = false;
  @Input() posts: Post[] = [];

  constructor() { }

  ngOnInit() {}
}
