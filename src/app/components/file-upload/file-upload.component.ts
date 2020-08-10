import { Component, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  error = null;
  result: any[];

  constructor(private dataService: DataService) {
  }

  fileChangeListener($event: any): void {

    const files = $event.srcElement.files;
    if (files[0].type !== "text/plain" && files[0].type !== "application/vnd.ms-excel") {
      this.error = "File must be of type .txt or .csv!";
      return;
    } else {
      this.error = null;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = () => {
      this.dataService.calculateEndResult(fileReader.result);
    }
    fileReader.onerror = (error) => {
      this.error = error
      console.log(error);
    }
  }

}
