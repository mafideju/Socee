import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  panelOpenState = false;
  posts: { id: number; author: string; title: string; content: string; }[];

  constructor() { }

  ngOnInit() {
    this.posts = [
      {
        id: 1,
        author: 'Mohamed Ali',
        title: 'Primeiro Post',
        content: 'Este é o primeiro post de teste'
      },
      {
        id: 2,
        author: 'Mike Tyson',
        title: 'Segundo Post',
        content: 'Este é o segundo post para diferenciar do primeiro'
      },
      {
        id: 3,
        author: 'Adilson Maguila',
        title: 'Terceiro Post',
        content: 'Mais um para finalizar os testes.'
      }
    ];
  }
}
