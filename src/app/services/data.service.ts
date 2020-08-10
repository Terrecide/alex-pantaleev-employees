import { Injectable } from '@angular/core';
import { EmployeeProjectData } from '../models/employeeProjectData.model';
import { EmployeePair } from '../models/employeePair.model';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  public passDataSubject = new Subject<EmployeePair[] | EmployeePair>();

  private parsedData: EmployeeProjectData[] = [];
  private pairsArray: EmployeePair[] = [];

  calculateEndResult(data: any) {
    this.parsedData = this.parseData(data);
    this.pairsArray = this.calculatePairs();
    this.passDataSubject.next(this.pairsArray);
  }

  parseData(data: any) {
    // parse the incoming data so its easier to work with 
    let parsedData = data.split('\n').map(record => {
      record = record.split(', ');
      if(record[3].indexOf('NULL') > -1) {
        record[3] = moment().format("YYYY-MM-DD")
      }

      return {
        employeeID: +record[0],
        projectID: +record[1],
        dateFrom: moment(record[2], "YYYY-MM-DD"),
        dateTo: moment(record[3], "YYYY-MM-DD"),
      }
    });

    return parsedData
  }

  calculatePairs() {
    this.parsedData.forEach(record => {
      this.parsedData.forEach(secondRecord => {
        // get only a pair that has the same project, different employee and overlaping days
        if (record.projectID == secondRecord.projectID && record.employeeID != secondRecord.employeeID && this.calculateOverlapingDays(record.dateFrom, record.dateTo,
              secondRecord.dateFrom, secondRecord.dateTo )) {
              // find if that pair already exists in pairsArray
              const existingPair = this.pairsArray.find((pair) => {
                return (record.employeeID == pair.employeeID1 && secondRecord.employeeID == pair.employeeID2) || (secondRecord.employeeID == pair.employeeID1 && record.employeeID == pair.employeeID2)
              })
              if (existingPair) {
                  // find if the period on the same project exists
                  const existingPeriod = existingPair.calculatedPeriods.find(period => {
                    return (period.projectID == record.projectID && period.from1 == record.dateFrom && period.from2 == secondRecord.dateFrom && period.to1 == record.dateTo && period.to2 == secondRecord.dateTo) ||
                    (period.projectID == record.projectID && period.from1 == secondRecord.dateFrom && period.from2 == record.dateFrom && period.to1 == secondRecord.dateTo && period.to2 == record.dateTo)
                  })
                  if (!existingPeriod) {
                    // if it doesn't exist create it and add days.
                    existingPair.daysWorkedTogether += this.calculateOverlapingDays(record.dateFrom, record.dateTo, secondRecord.dateFrom, secondRecord.dateTo)
                    existingPair.calculatedPeriods.push({projectID: record.projectID, from1: record.dateFrom, from2: secondRecord.dateFrom, to1: record.dateTo, to2: secondRecord.dateTo});
                  }
              }
              else {
                // if it doesn't exist create it.
                  this.pairsArray.push({ employeeID1: record.employeeID, employeeID2: secondRecord.employeeID, calculatedPeriods: [{projectID: record.projectID, from1: record.dateFrom, from2: secondRecord.dateFrom, to1: record.dateTo, to2: secondRecord.dateTo}],
                    daysWorkedTogether: this.calculateOverlapingDays(record.dateFrom, record.dateTo, secondRecord.dateFrom, secondRecord.dateTo ) })
              }
        }
      })
    })

    if(this.pairsArray.length > 0) {
      this.pairsArray.reduce(function (prev, current) {
          if (current.daysWorkedTogether > prev.daysWorkedTogether) {
              return current;
          } else {
              return prev;
          }
      });

      this.pairsArray.forEach(pair => {
        pair.projects = pair.calculatedPeriods.map(function (obj) {
          return obj.projectID;
        });
        pair.projects = [...new Set(pair.projects)];
      })
    }

    return this.pairsArray
    
  }

  // calculates overlaping days in 2 periods based on different conditions
  calculateOverlapingDays (dateFrom1, dateTo1, dateFrom2, dateTo2) {
    if (dateTo1.isBefore(dateFrom2) || dateFrom1.isAfter(dateTo2)) return 0
    else if (dateTo1.isBetween(dateFrom2, dateTo2, undefined, '[]') && dateFrom1.isBetween(dateFrom2, dateTo2, undefined, '[]')) return dateTo1.diff(dateFrom1, 'days')
    else if(dateTo2.isBetween(dateFrom1, dateTo1, undefined, '[]') && dateFrom2.isBetween(dateFrom1, dateTo1, undefined, '[]')) return dateTo2.diff(dateFrom2, 'days')
    else if (dateFrom1.isSameOrBefore(dateTo2) && dateTo1.isSameOrAfter(dateTo2)) {
        if (dateTo2.diff(dateFrom1, 'days') === 0) {
          return 1
        } else {
          return dateTo2.diff(dateFrom1, 'days')
        }
    } else if (dateTo1.isSameOrAfter(dateFrom2) && dateFrom1.isSameOrBefore(dateFrom2)) {
        if (dateTo1.diff(dateFrom2, 'days') === 0) {
          return 1
        } else {
          return dateTo1.diff(dateFrom2, 'days')
        }
    }
  }
}
