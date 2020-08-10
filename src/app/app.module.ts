import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DataGridComponent } from './components/data-grid/data-grid.component';
import { DataService } from './services/data.service';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    DataGridComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
