import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-succes',
  imports: [RouterLink],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css',
})
export class PaymentSuccess {

  paymentId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Capturamos el ID del pago que nos manda Mercado Pago por la URL
    this.paymentId = this.route.snapshot.queryParamMap.get('payment_id');
  }
}
