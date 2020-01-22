import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../feed.interfaces";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() public post: Post | null = null;

  constructor() {
  }

  ngOnInit() {
  }

}
