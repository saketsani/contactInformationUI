import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContactFormComponent } from './contact-form.component';
import { ContactServiceService } from '../../services/contact-service.service';
import { of } from 'rxjs';
import { Contact } from '../../models/contact-model';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let mockContactService: jasmine.SpyObj<ContactServiceService>;

  beforeEach(async () => {
    // Mock the ContactServiceService
    mockContactService = jasmine.createSpyObj('ContactServiceService', ['updateContact', 'addContact']);

    await TestBed.configureTestingModule({
      imports: [
        ContactFormComponent, // Import the standalone component
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [{ provide: ContactServiceService, useValue: mockContactService }], // Provide the mock service
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const form = component.contactForm;
    expect(form.value).toEqual({ id: null, firstname: '', lastname: '', email: '' });
  });

  it('should update form values when @Input contact is set', () => {
    const contact: Contact = { id: 1, firstname: 'Sourav', lastname: 'Kumar', email: 'souravkumar@gmail.com' };
    component.contact = contact; // Set the @Input property
    fixture.detectChanges();
    expect(component.contactForm.value).toEqual(contact);
  });

  it('should emit updated contact on submit for an existing contact', () => {
    const contact: Contact = { id: 1, firstname: 'Sourav', lastname: 'Kumar', email: 'souravkumar@gmail.com' };
    mockContactService.updateContact.and.returnValue(of(contact)); // Mock the updateContact response
    component.contactForm.setValue(contact);

    spyOn(component.contactUpdated, 'emit'); // Spy on the contactUpdated event
    component.onSubmit();

    expect(mockContactService.updateContact).toHaveBeenCalledWith(contact);
    expect(component.contactUpdated.emit).toHaveBeenCalledWith(contact);
  });

  it('should add contact on submit for a new contact', () => {
    const contact: Contact = { id: null, firstname: 'Sourav', lastname: 'Kumar', email: 'souravkumar@gmail.com' };
    const addedContact: Contact = { ...contact, id: 2 }; // Simulate the response with a new ID
    mockContactService.addContact.and.returnValue(of(addedContact)); // Mock the addContact response
    component.contactForm.setValue(contact);

    spyOn(component.contactAdded, 'emit'); // Spy on the contactAdded event
    component.onSubmit();

    expect(mockContactService.addContact).toHaveBeenCalledWith(contact);
    expect(component.contactAdded.emit).toHaveBeenCalledWith(addedContact);
  });

  it('should toggle the form visibility', () => {
    expect(component.showForm).toBeFalse(); // Initially, showForm should be false
    component.toggleForm();
    expect(component.showForm).toBeTrue(); // After toggling, showForm should be true
    component.toggleForm();
    expect(component.showForm).toBeFalse(); // Toggling again, showForm should be false
  });
});
