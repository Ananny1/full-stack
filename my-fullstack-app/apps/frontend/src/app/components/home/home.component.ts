import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { PostService, Post } from '../../services/post.service';
import { selectUser } from '../../store/auth/auth.selectors';
import { User } from '../../store/auth/auth.state';
import * as AuthActions from '../../store/auth/auth.actions';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  user$: Observable<User | null>;
  posts$: Observable<Post[]>;
  showCreateForm = false;
  newContent = '';

  constructor(private postService: PostService, private store: Store) {
    this.user$ = this.store.select(selectUser);
    this.posts$ = this.postService.getPosts();
  }

  ngOnInit(): void {}

  createPost() {
    if (!this.newContent.trim()) return;

    // Call API to create a new post, then refresh feed
    this.postService.createPost(this.newContent).subscribe(() => {
      this.newContent = '';
      this.showCreateForm = false;
      this.posts$ = this.postService.getPosts();
    });
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
