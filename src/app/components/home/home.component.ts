import { HotToastService } from '@ngneat/hot-toast';
import { odev } from '../../models/odev';
import { FbservisService } from './../../services/fbservis.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  mevcutodevler: odev[] = [];
  eskiodevler: odev[] = [];
  frm: FormGroup = new FormGroup({
    baslik: new FormControl(),
    aciklama: new FormControl(),
    tamam: new FormControl()
  });
  constructor(
    public fbservis: FbservisService,
    public htoast: HotToastService
  ) { }

  ngOnInit() {
    this.odevListele();
    this.fbservis.aktifUye.subscribe(d => {
      console.log(d);
    });
  }
  odevListele() {
    this.fbservis.odevListele().subscribe(d => {
      this.mevcutodevler = d.filter(s => s.tamam == false || s.tamam == null);
      this.eskiodevler = d.filter(s => s.tamam == true);
    });
  }
  Kaydet() {
    // console.log(this.frm.value);
    this.fbservis.odevEkle(this.frm.value)
      .pipe(
        this.htoast.observe({
          success: 'Ödev Eklendi',
          loading: 'Ödev Ekleniyor...',
          error: ({ message }) => `${message}`
        })
      )
      .subscribe();
  }
  Sil(odev: odev) {
    this.fbservis.odevSil(odev).then(() => {

    });
  }
  TamamIptal(odev: odev, d: boolean) {
    odev.tamam = d;
    this.fbservis.odevDuzenle(odev).then(() => {

    });
  }
}
