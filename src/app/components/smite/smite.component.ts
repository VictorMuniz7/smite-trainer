import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { OptionsService } from '../../services/options.service';

@Component({
  selector: 'app-smite',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './smite.component.html',
  styleUrl: './smite.component.scss'
})
export class SmiteComponent implements OnInit{
  @HostListener('document:keydown.f', ['$event'])
  handleF(){
    if(this.fogMode){
      if(!this.disableFlash)
      this.getVision()
    } else {
      this.handleKeyboardEvent()
    }
  }
  @HostListener('document:keydown.d', ['$event'])
  @HostListener('document:keydown.space', ['$event'])
  handleKeyboardEvent() {
    if(!this.disableSmite)
    this.smite()
  }

  private optionsService = inject(OptionsService)

  currentLife: number = 0;
  lifeLeft: number = 0;

  score: string = ''

  interval: any;
  timeout: any;
  flashTimeout: any;
  visionTimeout: any;

  wins: boolean = false

  gamemode: string = ''
  smiteDamage: number = 0
  fogMode: boolean = false

  noVision: boolean = false

  disableButton: boolean = false
  disableSmite: boolean = true
  disableFlash: boolean = true

  message: string = ''

  route = inject(Router)

  ngOnInit(): void {
    this.optionsService.currentOption.subscribe(option => {
      if(option){
        this.gamemode = option.gamemode
        this.smiteDamage = Number(option.smite)
        this.fogMode = option.fog
        if(this.fogMode){
          this.currentLife = Math.floor(Math.random() * (this.roundLife(this.smiteDamage * 8.3) - this.smiteDamage * 4) + this.smiteDamage * 3)
        }else{
          this.currentLife = this.roundLife(this.smiteDamage * 8.3)
        }
        this.startGame()
      } else {
        this.route.navigate([''])
      }
    })
  }

  startGame(){
    if(this.fogMode){
      this.currentLife = Math.floor(Math.random() * (this.roundLife(this.smiteDamage * 8.3) - this.smiteDamage * 4) + this.smiteDamage * 3)
      this.disableFlash = true
      this.visionTimeout = setTimeout(() => {
      this.noVision = true
      this.disableFlash = false
      }, 1000)
    }
    if(!this.fogMode){
      this.disableSmite = false
    }
    this.disableButton = true
    this.interval = setInterval(() => {
      if(this.currentLife > 0){
        this.currentLife -= Math.floor(Math.random() * (this.smiteDamage / 2))
        }
      if(this.gamemode == 'contest' && this.currentLife <= (this.smiteDamage + 200)){
        this.timeout = setTimeout(() => {
          this.currentLife -= this.smiteDamage;
          if(this.currentLife < 0)
          this.currentLife = 0;
        }, 200)
      }
      if(this.currentLife <= 0){
        this.message = this.missedMessage()
        this.currentLife = 0
        clearInterval(this.interval)
        this.disableSmite = true
        this.disableFlash = true
        this.disableButton = false
      }
    }, 200)
  }

  smite(){
    this.playSound('https://raw.githubusercontent.com/VictorMuniz7/smite-trainer/main/src/assets/sound-effects/smite-sound.mp3', 0.6)
    clearTimeout(this.timeout)
    clearInterval(this.interval)
    clearTimeout(this.flashTimeout)
    this.disableButton = false
    this.disableSmite = true
    if(this.currentLife > 0){
      this.lifeLeft = this.currentLife - this.smiteDamage
      this.currentLife -= this.smiteDamage;
      if(this.currentLife <= 0){
        this.score = 100 - (Math.floor(((this.lifeLeft * -1) / this.smiteDamage) * 100)) + '%'
        this.currentLife = 0
        this.wins = true
        this.message = 'Nice smite! SCORE = ' + this.score
        this.playSound(`https://raw.githubusercontent.com/VictorMuniz7/smite-trainer/main/src/assets/sound-effects/objective-dying-${Math.floor(Math.random() * (2 - 1 + 1)) + 1}.mp3`, 0.3)
      } else {
        this.lose()
      }
    } else {
      this.lose()
    }
  }

  getVision(){
    this.disableFlash = true
    this.disableSmite = false
    this.noVision = false
    this.playSound('https://raw.githubusercontent.com/VictorMuniz7/smite-trainer/main/src/assets/sound-effects/flash-sound.mp3', 0.3)
    this.flashTimeout = setTimeout(() => {
      this.lose()
      clearInterval(this.interval)
      this.disableSmite = true
    }, 1200)
  }

  playSound(path: string, volume: number){
    const audio = new Audio(path)
    audio.volume = volume
    audio.play()
  }

  lose(){
    this.wins = false
    this.message = this.missedMessage()
    this.disableButton = false
    this.playSound('https://raw.githubusercontent.com/VictorMuniz7/smite-trainer/main/src/assets/sound-effects/pings-sound-effect.mp3', 0.7)
  }

  reset(){
    this.wins = false
    this.currentLife = this.roundLife(this.smiteDamage * 8.3)
    this.message = ''
    this.noVision = false
    clearInterval(this.interval)
    clearTimeout(this.timeout)
    clearTimeout(this.flashTimeout)
    clearTimeout(this.visionTimeout)
  }

  missedMessage(){
    let chance = Math.floor(Math.random() * 100)
    if(chance < 20){
      return 'You missed, FF FCKIN JG DIFF'
    } else {
      return 'You missed, nice try'
    }
  }

  roundLife(value: number){
    return Math.ceil(value / 50) * 50;
  }
}
