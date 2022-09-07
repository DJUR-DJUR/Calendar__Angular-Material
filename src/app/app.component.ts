import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService, Task } from './task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  public selectedDate: Date = new Date
  public form!: FormGroup
  public todos: Task[] = []
  public dones: Task[] = []
  public loader: boolean = false

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loader = true
    this.taskService.load(this.selectedDate.toDateString())
      .subscribe(tasks => {
        this.todos = tasks.filter(item => item.done == false)
        this.dones = tasks.filter(item => item.done == true)
        this.loader = false
    })

    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    })
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  submit() {
    const title: string = this.form.value.title
    const task: Task = {
      title,
      done: false,
      date: this.selectedDate.toDateString()
    }
    this.taskService.create(task).subscribe(task => {
      this.todos.push(task)
      this.form.reset()
    }, err => console.error(err))
  }

  remove(task: Task) {
    this.taskService.remove(task).subscribe(() => {
      this.dones = this.dones.filter(t => t.id !== task.id)
    }, err => console.error(err))
  }

  getSelectedChange(changeDate: Date) {
    this.loader = true
    this.taskService.load(changeDate.toDateString())
      .subscribe(tasks => {
        this.todos = tasks.filter(item => item.done == false)
        this.dones = tasks.filter(item => item.done == true)
        this.loader = false
      })
  }

}
