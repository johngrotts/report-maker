import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiTestComponent } from "./test/ui-test/ui-test.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UiTestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'report-maker';
}
