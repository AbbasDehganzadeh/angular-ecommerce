import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { map, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { OrderService } from "../services/order.service";

export const hasBeenCheckedout: CanActivateFn = (route, state) => {
  const router = inject(Router);

  function navigate(path: string) {
    if (path === "checkout") return router.navigate(["/cart"]);
    return router.navigate(["/shop", "products"]);
  }

  if (!route.queryParamMap.has("orderId")) {
    navigate(route.url[0].path);
    return of(false);
  }
  const { orderId } = route.queryParams;
  return inject(OrderService)
    .getOrder(orderId)
    .pipe(
      map((data) => {
        if (data.order.status !== "paid" || route.url[0].path !== "checkout")
          return true;
        navigate(route.url[0].path);
        return false;
      }),
      catchError(() => {
        navigate(route.url[0].path);
        return of(false);
      }),
    );
};
