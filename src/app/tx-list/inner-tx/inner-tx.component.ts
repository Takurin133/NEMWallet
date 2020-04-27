import { Component, OnInit, Input } from '@angular/core';
import { InnerTxInfo } from 'src/app/model/inner-tx-info';

@Component({
  selector: 'app-inner-tx',
  templateUrl: './inner-tx.component.html',
  styleUrls: ['./inner-tx.component.scss'],
})
export class InnerTxComponent implements OnInit {

  @Input() recipient: string;
  @Input() amount: string;
  @Input() message: string;


  constructor() { }

  ngOnInit() {}

}
