import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Contact } from '../models/contact-model';

@Injectable({
  providedIn: 'root'
})
export class ContactServiceService {

  apiUrl = 'https://localhost:7004/api';
  constructor(private http: HttpClient) { }

  getContacts(){
    return this.http.get<any>(`${this.apiUrl}/Contacts`);
  }
  updateContact(updatedContact: Contact) {
    return this.http.put<Contact>(`${this.apiUrl}/Contacts/${updatedContact.id}`, updatedContact);
  }
  addContact(contact: Contact) {
    return this.http.post<Contact>(`${this.apiUrl}/Contacts`, contact).pipe(
      catchError((error) => {
        console.error('Error adding contact:', error);
        return throwError(() => new Error(error));
      })
    );
  }
  deleteContact(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/Contacts/${id}`).pipe(
      tap(() => {
        console.log(`Contact with ID ${id} deleted successfully.`);
      }),
      catchError((error) => {
        console.error('Error deleting contact:', error);
        return throwError(() => new Error(error));
      })
    );
  }
}
