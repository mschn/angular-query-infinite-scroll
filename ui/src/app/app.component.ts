import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  color: string;
  company: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  http = inject(HttpClient);
  pageSize = 50;

  customers = injectInfiniteQuery(() => ({
    queryKey: ['customers'],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      lastValueFrom(
        this.http.get<Customer[]>(
          `http://localhost:3000/customers?page=${pageParam}&page_size=${this.pageSize}`,
        ),
      ),
    getNextPageParam: (lastPage) => lastPage[0].id / this.pageSize + 1,
    select: (data) => data.pages.flat(),
  }));
}
