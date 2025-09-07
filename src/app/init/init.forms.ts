import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserRole } from "../models/user.model";
import { nonZeroValidator } from "../validators/validator";
import { InitConfig } from "./init.config";

export class InitForms {

    static initializeUserFilterForm(role: UserRole, companyId: number): FormGroup {
        
        return new FormGroup({
            inputText: new FormControl(''),
            role: new FormControl(''),
            companyId: role === 'ADMIN'
            ? new FormControl('0')
            : new FormControl(companyId),
            orgUnitId: new FormControl('0'),
            isActive: new FormControl(true)
        });
    
    }


    static initializeUserForm(role: UserRole, companyId: number): FormGroup {

        const companyValidators = [];
        if (role === 'ADMIN') {
            companyValidators.push(Validators.required);
        }

        return new FormGroup({
            userId: new FormControl(0),
            firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
            lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
            email: new FormControl('', [Validators.required, Validators.email]),
            username: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            passwordRepeat: new FormControl('', [Validators.required, Validators.minLength(6)]),
            role: new FormControl('', [Validators.required]),
            address: new FormControl(''),
            phone: new FormControl(''),
            companyId: role === 'ADMIN' ? new FormControl(0) : new FormControl(+companyId!, companyValidators),
            orgUnitId: new FormControl(0, [nonZeroValidator(), Validators.required]),
            isActive: new FormControl(true)
        });
    }

    static initializeOrderFilterForm(): FormGroup {
        return new FormGroup({
            startDate: new FormControl(InitConfig.initStartDate()),
            endDate: new FormControl(InitConfig.initEndDate()),
            status: new FormControl(''),
            companyId: new FormControl(0),
            orgUnitId: new FormControl(0)
        });
    }
}