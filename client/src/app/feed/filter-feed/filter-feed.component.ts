import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../feed.interfaces";
import {SocketService} from "../socket.service";
import {ActivatedRoute, Router} from '@angular/router';
import { type } from 'os';


@Component({
  selector: 'app-filter-feed',
  templateUrl: './filter-feed.component.html',
  styleUrls: ['./filter-feed.component.scss'], 
  providers: [SocketService]
})
export class FilterFeedComponent implements OnInit {
  public posts: Post[] = [];

  constructor(private socket: SocketService, private route: ActivatedRoute, private router: Router) { 
  }

  ngOnInit(): void {
      this.socket.posts$.subscribe(posts => this.posts = posts);
      this.filterUrl();
  }

  ngOnDestroy(): void {
    this.socket.close();
  }

  filterUrl():void{
    var filter = this.route.snapshot.paramMap.get('filter');
    
    var type : string = this.route.snapshot.url[0].path;
    if(filter){
        filter = filter.trim();
        this.socket.filter(filter, type);
      }
  }

  filter(filter: string, type: string) {
    filter = filter.trim();
    this.router.navigate(['hashtag', filter]);
    this.socket.filter(filter, type);
  }
   

}
