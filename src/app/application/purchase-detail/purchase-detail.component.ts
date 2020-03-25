import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/cores/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/cores/helper/data.service';
import { config } from '../../cores/configuration';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.css']
})
export class PurchaseDetailComponent implements OnInit {
  productName: any;
  cashDownAmount: any;
  currentUser: any;
  id: string;
  purchaseInfo: any = {};
  productType: any = {};
  purchaseInfoProductDtoList: any = [];
  imageUrl: string = config.purchaseImgUrl;

  constructor(
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private dataService: DataService
  ) {

    this.id = this.activeRoute.snapshot.paramMap.get('id');
    this.authService.currentUser.subscribe( (res: any) => { this.currentUser = res.data; });

  }

  ngOnInit() {
    this.authService.refreshToken();
    this.dataLoader();
  }

  private dataLoader() {
    this.dataService.getProductTypeList().subscribe(
      (res: any) => {
        if (res.status === 'SUCCESS' && res.data !== null) {
          this.productType = res.data;


        }
      }

    );
    this.dataService.getPurchaseInfoDetail(this.currentUser.access_token, this.id).subscribe(
      (res: any) => {
        if (res.status === 'SUCCESS' && res.data !== null) {
          this.purchaseInfo = res.data;
          console.log(this.purchaseInfo);
          this.getLoanTypeList();
          for (const purchaseList of res.data.purchaseInfoProductDtoList) {
            this.productType.find( (key: any) => {
              if (purchaseList.daProductTypeId === key.productTypeId) {

                  this.productName = key.name;

              }});
              this.cashDownAmount = purchaseList.cashDownAmount;
            this.purchaseInfoProductDtoList .push({
            productDescription: purchaseList.productDescription,
            daProductTypeId: this.productName,
            brand : purchaseList.brand,
            model: purchaseList.model,
            price: purchaseList.price
          });

        }
        }
      }
    );

  }

  private getLoanTypeList() {
    this.dataService.getLoanTypeList(this.currentUser.access_token).subscribe( (loanType: any) => {
      loanType.data.find((key: any) => {
        if (key.loanTypeId === this.purchaseInfo.daLoanTypeId) {
          this.purchaseInfo.daLoanTypeTitle = key.name;
        }

      });
    });
  }
}
 