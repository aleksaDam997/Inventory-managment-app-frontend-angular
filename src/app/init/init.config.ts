import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";

export class InitConfig {
    static initDatePickerConfig(): Partial<BsDatepickerConfig> {

        return {
            containerClass: 'theme-blue', // default je 'theme-green'
            dateInputFormat: 'DD.MM.YYYY',
            // minDate: new Date(2025, 0, 1),
            // maxDate: new Date(2025, 11, 31),
            // showWeekNumbers: true, 
            // isAnimated: true,
            // adaptivePosition: true, 
            // showTodayButton: true,  
            // showClearButton: true,
            // customClasses: [
            //   { date: new Date(2025, 7, 15), classes: ['bg-danger', 'text-white'] }
            // ],
            // isDisabled: false,
            // selectWeek: false
            };
    }

    static initStartDate(): Date {
        const startDate: Date = new Date();
        startDate.setDate(1)
        startDate.setSeconds(0)
        startDate.setMinutes(0)
        startDate.setHours(0)
        return startDate;
    }

    static initEndDate(): Date {
        const endDate: Date = new Date();
        endDate.setSeconds(59)
        endDate.setMinutes(59)
        endDate.setHours(23)
        return endDate;
    }

}
