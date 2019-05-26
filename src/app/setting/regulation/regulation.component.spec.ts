import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulationComponent } from './regulation.component';
import { AppModule } from '../../app.module';
import { OnsNavigator } from 'ngx-onsenui';

describe('RegulationComponent', () => {
    let component: RegulationComponent;
    let fixture: ComponentFixture<RegulationComponent>;
    let mockOnsNavigator: OnsNavigator;

    beforeEach(async(() => {
        mockOnsNavigator = jasmine.createSpyObj('mockOnsNavigator', ['']);
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [
                { provide: OnsNavigator, useValue: mockOnsNavigator },
            ],
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegulationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
