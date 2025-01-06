import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { ContactServiceService } from './services/contact-service.service';
import { of } from 'rxjs';
import { Contact } from './models/contact-model';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockContactService: jasmine.SpyObj<ContactServiceService>;

  const mockContacts: Contact[] = [
    { id: 1, firstname: 'saket', lastname: 'sani', email: 'saketsani123@gmail.com' },
    { id: 2, firstname: 'sourav', lastname: 'kumar', email: 'souravkumar@gmail.com' },
  ];

  beforeEach(async () => {
    mockContactService = jasmine.createSpyObj('ContactServiceService', [
      'getContacts',
      'deleteContact',
    ]);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AppComponent],
      providers: [{ provide: ContactServiceService, useValue: mockContactService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should load contacts on initialization', () => {
    mockContactService.getContacts.and.returnValue(of(mockContacts));

    component.ngOnInit();

    expect(mockContactService.getContacts).toHaveBeenCalled();
    expect(component.contacts).toEqual(mockContacts);
  });

  it('should add a new contact to the list', () => {
    const newContact: Contact = { id: 3, firstname: 'kunal', lastname: 'kumar', email: 'kunal kuamr@gmail.com' };

    component.onContactAdded(newContact);

    expect(component.contacts).toContain(newContact);
    expect(component.selectedContact).toBeNull();
  });

  it('should set the selected contact for editing', () => {
    const contactToEdit: Contact = mockContacts[0];

    component.onEditContact(contactToEdit);

    expect(component.selectedContact).toEqual(contactToEdit);
  });

});
