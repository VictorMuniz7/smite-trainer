import { Component, HostListener, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-smite',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './smite.component.html',
  styleUrl: './smite.component.scss'
})
export class SmiteComponent implements OnInit{
  @HostListener('document:keydown.f', ['$event'])
  @HostListener('document:keydown.d', ['$event'])
  @HostListener('document:keydown.space', ['$event'])
  handleKeyboardEvent() {
    if(!this.disableSmite)
    this.smite()
  }

  currentLife: number = 12000;

  interval: any;
  timeout: any;

  gamemode: string = 'normal'

  disableButton: boolean = false
  disableSmite: boolean = true

  message: string = ''

  route = inject(ActivatedRoute)

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const option = params.get('gamemode')
      if(option){
        this.gamemode = option
      }
      this.startGame()
    })
  }

  startGame(){
    this.disableSmite = false
    this.disableButton = true
    this.interval = setInterval(() => {
      if(this.currentLife > 0){
        this.currentLife -= Math.floor(Math.random() * 600)
        }
      if(this.gamemode == 'contest' && this.currentLife <= 1400){
        this.timeout = setTimeout(() => {
          this.currentLife -= 1200;
          this.currentLife = 0;
        }, 100)
      }
      if(this.currentLife <= 0){
        this.message = this.missedMessage()
        this.currentLife = 0
        clearInterval(this.interval)
        this.disableSmite = true
        this.disableButton = false
      }
    }, 200)

  }

  smite(){
    this.playSound()
    clearTimeout(this.timeout)
    clearInterval(this.interval)
    this.disableButton = false
    this.disableSmite = true
    if(this.currentLife > 0){
      this.currentLife -= 1200;
      if(this.currentLife <= 0){
        this.currentLife = 0
      }
    }
    if(this.currentLife <= 0){
      this.message = 'Congratz, you did it!'
    }
    else{
      this.message = this.missedMessage()
    }
  }

  playSound(){
    const audio = new Audio('https://raw.githubusercontent.com/VictorMuniz7/smite-trainer/main/src/assets/smite-sound.mp3')
    audio.volume = 0.3
    audio.play();
  }

  reset(){
    this.currentLife = 12000
    this.message = ''
    clearInterval(this.interval)
  }

  missedMessage(){
    let chance = Math.floor(Math.random() * 100)
    if(chance < 20){
      return 'You missed, FF FCKIN JG DIFF'
    } else {
      return 'You missed, nice try'
    }
  }
}
