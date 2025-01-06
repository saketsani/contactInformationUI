import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsListComponent } from './contacts-list.component';
import { Contact } from '../../models/contact-model';
import { By } from '@angular/platform-browser';

describe('ContactsListComponent', () => {
  let component: ContactsListComponent;
  let fixture: ComponentFixture<ContactsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list of contacts', () => {
    const mockContacts: Contact[] = [
      { id: 1, firstname: 'saket', lastname: 'sani', email: 'saketsani123@gmail.com' },
      { id: 2, firstname: 'sourav', lastname: 'kumar', email: 'souravkumar@gmail.com' },
    ];
    component.contacts = mockContacts; // Set the input
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(mockContacts.length);

    // Check content of the first row
    const firstRowCells = rows[0].queryAll(By.css('td'));
    expect(firstRowCells[0].nativeElement.textContent).toBe('1'); 
    expect(firstRowCells[1].nativeElement.textContent).toBe('saket');
    expect(firstRowCells[2].nativeElement.textContent).toBe('sani');
    expect(firstRowCells[3].nativeElement.textContent).toBe('saketsani123@gmail.com');
  });

  it('should emit editContact event when edit button is clicked', () => {
    const mockContact: Contact = { id: 1, firstname: 'saket', lastname: 'sani', email: 'saketsani123@gmail.com' };
    spyOn(component.editContact, 'emit');

    component.contacts = [mockContact]; 
    fixture.detectChanges();

    const editButton = fixture.debugElement.query(By.css('button.btn-primary'));
    editButton.triggerEventHandler('click', null); // click event

    expect(component.editContact.emit).toHaveBeenCalledWith(mockContact); // Check the emitted value
  });

  it('should emit deleteContact event when delete button is clicked', () => {
    const mockContact: Contact = { id: 1, firstname: 'saket', lastname: 'sani', email: 'saketsani123@gmail.com' };
    spyOn(component.deleteContact, 'emit');

    component.contacts = [mockContact]; // Set the input
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('button.btn-danger'));
    deleteButton.triggerEventHandler('click', null);

    expect(component.deleteContact.emit).toHaveBeenCalledWith(mockContact.id);
  });
});
