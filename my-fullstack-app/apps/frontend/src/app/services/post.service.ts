import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Shape of a post object
export interface Post {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  content: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  // Base API URL (fallback to localhost if env var not set)
  private apiUrl = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Fetch all posts
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  // Create a new post with given content
  createPost(content: string): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, { content });
  }
}
