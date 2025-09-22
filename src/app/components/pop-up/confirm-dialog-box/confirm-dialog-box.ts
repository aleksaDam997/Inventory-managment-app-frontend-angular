import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-dialog-box',
  imports: [],
  templateUrl: './confirm-dialog-box.html',
  styleUrl: './confirm-dialog-box.css'
})
export class ConfirmDialogBox {
  title?: string;
  message?: string;
  onConfirm?: () => void; // callback za "Da"
  onCancel?: () => void;  // callback za "Ne"

  constructor(public bsModalRef: BsModalRef) {}
}
