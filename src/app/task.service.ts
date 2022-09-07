import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"


export interface Task {
  id?: string
  title: string
  date?: string
  done: boolean
}

interface CreateResponse {
  name: string
}

@Injectable({providedIn: 'root'})
export class TaskService {
  static url = 'https://calendar-angular-material-default-rtdb.europe-west1.firebasedatabase.app/tasks'

  constructor(private http: HttpClient) {}

  load(date: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${TaskService.url}/${date}.json`)
    .pipe(map(tasks => {
      if (!tasks) {
        return []
      }
      return Object.keys(tasks).map((key: any) => ({...tasks[key], id: key}))
    }))
  }

  create(task: Task): Observable<Task> {
    return this.http.post<CreateResponse>(`${TaskService.url}/${task.date}.json`, task)
    .pipe(map(res => {
      return {...task, id: res.name}
    }))
  }

  remove(task: Task): Observable<void> {
    return this.http.delete<void>(`${TaskService.url}/${task.date}/${task.id}.json`);
  }
}
