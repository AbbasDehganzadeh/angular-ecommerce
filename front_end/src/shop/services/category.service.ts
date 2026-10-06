import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class CategoryService {
  private selectedCategory = new BehaviorSubject<string>("");

  constructor(private router: Router) {}

  selectCategory(category: string) {
    this.selectedCategory.next(category);
    this.router.navigate(["/shop/products"], {
      queryParams: { category },
      queryParamsHandling: "merge",
    });
  }

  clearCategory() {
    this.selectedCategory.next("");
    this.router.navigate(["/shop/products"], {
      queryParams: { category: null },
      queryParamsHandling: "merge",
    });
  }
}
