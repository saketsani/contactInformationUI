import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContactServiceService } from './contact-service.service';
import { Contact } from '../models/contact-model';

describe('ContactServiceService', () => {
  let service: ContactServiceService;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://localhost:7004/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactServiceService],
    });

    service = TestBed.inject(ContactServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch contacts', () => {
    const mockContacts: Contact[] = [
      { id: 1, firstname: 'saket', lastname: 'sani', email: 'saketsani123@gmail.com' },
      { id: 2, firstname: 'sourav', lastname: 'kumar', email: 'souravkuamr@gmail.com' },
    ];

    service.getContacts().subscribe((contacts) => {
      expect(contacts).toEqual(mockContacts);
    });

    const req = httpMock.expectOne(`${apiUrl}/Contacts`);
    expect(req.request.method).toBe('GET');
    req.flush(mockContacts);
  });

  it('should update a contact', () => {
    const updatedContact: Contact = { id: 1, firstname: 'saket', lastname: 'sani', email: 'saketsani123@gmail.com' };

    service.updateContact(updatedContact).subscribe((response) => {
      expect(response).toEqual(updatedContact);
    });

    const req = httpMock.expectOne(`${apiUrl}/Contacts/${updatedContact.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedContact);
    req.flush(updatedContact);
  });

  it('should add a new contact', () => {
    const newContact: Contact = { id: null, firstname: 'saket', lastname: 'sani', email: 'saketsani123@gmail.com' };
    const addedContact: Contact = { ...newContact, id: 3 };

    service.addContact(newContact).subscribe((response) => {
      expect(response).toEqual(addedContact);
    });

    const req = httpMock.expectOne(`${apiUrl}/Contacts`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newContact);
    req.flush(addedContact);
  });

  it('should handle error while adding a contact', () => {
    const newContact: Contact = { id: null, firstname: 'saket', lastname: 'sani', email: 'saketsani123@gmail.com' };

    service.addContact(newContact).subscribe(
      () => fail('Expected error, but succeeded'),
      (error) => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne(`${apiUrl}/Contacts`);
    expect(req.request.method).toBe('POST');
    req.flush('Error adding contact', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should delete a contact', () => {
    const contactId = 1;

    service.deleteContact(contactId).subscribe(() => {
      expect().nothing(); // No data expected for DELETE response
    });

    const req = httpMock.expectOne(`${apiUrl}/Contacts/${contactId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle error while deleting a contact', () => {
    const contactId = 1;

    service.deleteContact(contactId).subscribe(
      () => fail('Expected error, but succeeded'),
      (error) => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne(`${apiUrl}/Contacts/${contactId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Error deleting contact', { status: 500, statusText: 'Internal Server Error' });
  });
});
