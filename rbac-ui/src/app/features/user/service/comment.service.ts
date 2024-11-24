import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { Comments } from '../model/comments';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly baseUrl = environment.apiBaseUrl+ environment.endpoints.comments; // json-server URL

  constructor(private http: HttpClient) {}

  /**
   * Fetch all comments
   * @returns Observable of comments array
   */
  getComments(): Observable<Comments[]> {
    return this.http.get<Comments[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Add a new comment
   * @param comment The comment object to add
   * @returns Observable of the created comment
   */
  addComment(comment: Comments): Observable<Comments> {
    return this.http.post<Comments>(this.baseUrl, comment).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing comment
   * @param id The ID of the comment to update
   * @param updatedComment The updated comment data
   * @returns Observable of the updated comment
   */
  updateComment(id: number, updatedComment: Partial<Comments>): Observable<Comments> {
    return this.http.put<Comments>(`${this.baseUrl}/${id}`, updatedComment).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete a comment
   * @param id The ID of the comment to delete
   * @returns Observable of the response
   */
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Error handler for HTTP requests
   * @param error The error response
   * @returns An Observable error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(
      error.error?.message || 'Something went wrong. Please try again later.'
    );
  }
}
