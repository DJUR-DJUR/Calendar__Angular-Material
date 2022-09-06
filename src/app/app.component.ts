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

  selectedDate: Date  = new Date
  form!: FormGroup
  tasks: Task[] = []

  todos: string[] = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep']

  dones: string[] = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog']

  constructor(private taskService: TaskService) {}

  //Function that find Unique Value by Property in an Array of Objects
  private getUniqValue = function(array: any[], key: string | number, state: boolean): string[] {
    return array
      .filter(item => item.done == state)
      .reduce((acc, curr) => {
        return acc.concat(curr[key])
      }, [])
}

  ngOnInit() {
      this.taskService.load(this.selectedDate.toDateString())
    .subscribe(tasks => {
      this.tasks = tasks
     // console.log('upload', tasks);
      this.todos = this.getUniqValue(tasks, 'title', false)
     // console.log('upload todos', this.todos);
      this.dones = this.getUniqValue(tasks, 'title', true)
      //console.log('upload dones', this.dones);
    })

    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    })
  }

  drop(event: CdkDragDrop<string[]>) {
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
      console.log('Task', task);

      this.todos.push(title)
      this.form.reset()
    }, err => console.error(err))
}

  delete(item: string) {
      this.dones = this.dones.filter(d => d !== item)
}

}
