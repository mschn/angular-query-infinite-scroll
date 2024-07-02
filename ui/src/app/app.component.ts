import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { delay, lastValueFrom } from 'rxjs';

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
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);
  pageSize = 50;

  customers = injectInfiniteQuery(() => ({
    queryKey: ['customers'],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      lastValueFrom(
        this.http
          .get<
            Customer[]
          >(`http://localhost:3000/customers?page=${pageParam}&page_size=${this.pageSize}`)
          .pipe(delay(500)),
      ),
    getNextPageParam: (lastPage) => lastPage[0].id / this.pageSize + 1,
    select: (data) => data.pages.flat(),
  }));

  ngOnInit() {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.customers.fetchNextPage();
      }
    });
    observer.observe(document.querySelector('#loader') as Element);
  }
}
