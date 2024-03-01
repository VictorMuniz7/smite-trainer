import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { OptionsService } from '../../services/options.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  formBuilder = inject(FormBuilder)
  optionForm = this.formBuilder.group({
    gamemode: 'normal',
    smite: '600'
  })

  private optionsService = inject(OptionsService)

  sendData(){
    this.optionsService.changeOption(this.optionForm.value)
  }

}
