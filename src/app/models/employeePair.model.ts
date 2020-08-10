import { Period } from './period.model';

export class EmployeePair {
    employeeID1: number;
    employeeID2: number;
    daysWorkedTogether: number;
    calculatedPeriods?: Period[];
    projects?: number[];
}