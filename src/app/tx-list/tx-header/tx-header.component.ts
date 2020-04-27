import { Component, OnInit, Input } from '@angular/core';
import { LocalDateTime } from 'js-joda';

@Component({
  selector: 'app-tx-header',
  templateUrl: './tx-header.component.html',
  styleUrls: ['./tx-header.component.scss'],
})
export class TxHeaderComponent implements OnInit {

  @Input() id: string;
  @Input() deadline: LocalDateTime;
  @Input() height: number;

  constructor() { }

  ngOnInit() {}

}
