import * as moment from 'moment';

export class EmployeeProjectData {
    employeeID: number;
    projectID: number;
    dateFrom: moment.Moment;
    dateTo: moment.Moment;
}