import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';

import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuoteInput } from '../../quote-input/quote-input.component';
import { DealView } from '../deal.view';

export type CloseDealResult = {
  result: boolean;
  deal: DealView;
};

@Component({
  selector: 'app-close-deal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,

    CalendarModule,
    InputNumberModule,
    InputTextareaModule,

    QuoteInput,
  ],
  templateUrl: './close-deal-dialog.component.html',
  styleUrl: './close-deal-dialog.component.scss'
})
export class CloseDealDialog implements OnInit {
  deal!: DealView;

  closeDealForm = this.formBuilder.group({
    closeDate: DateTime.now().toFormat('MM/DD/YYYY'),
    closePrice: null,
    notes: null,
  } as {
    closeDate: string | null,
    closePrice: number | null,
    notes: string | null,
  });

  result = false;

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
      this.closeDealForm.patchValue({
        closeDate: this.deal.closeDate,
        closePrice: this.deal.closePrice,
        notes: this.deal.notes,
      });
  }

  save() {
    this.result = true;
    this.deal.closeDate = this.closeDealForm.value.closeDate || null;

    if (this.closeDealForm.value.closePrice != null) {
      this.deal.closePrice = this.closeDealForm.value.closePrice;
    } else {
      this.deal.closePrice = null;
    }

    this.deal.notes = this.closeDealForm.value.notes || null;

    this.bsModalRef.hide();
  }

  cancel() {
    this.result = false;
    this.bsModalRef.hide();
  }
}
