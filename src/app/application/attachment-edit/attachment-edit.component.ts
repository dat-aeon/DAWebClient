import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/cores/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/cores/helper/data.service';
import { config } from '../../cores/configuration';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-attachment-edit',
  templateUrl: './attachment-edit.component.html',
  styleUrls: ['./attachment-edit.component.css']
})
export class AttachmentEditComponent implements OnInit {
  limitPhoto: any;
  nextLoading = false;
  submitted: boolean;
  attachmentEditForm: FormGroup;
  id: string;
  currentUser: any;
  attachmentEditDtoList:  any = [];
  applicationInfoAttachmentDtoList : any =[];
  imageUrl: string = config.imageUrl;
  imageType: string = 'data:image/png;base64,';

  constructor(    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private dataService: DataService
  ) {

    const navigation = this.router.getCurrentNavigation();

    if(navigation.extras.state) {
      this.id = navigation.extras.state.orderId;
    } else {
      this.router.navigateByUrl('/inquery');
    }

    this.authService.currentUser.subscribe( (res: any) => { this.currentUser = res.data; }); 
  }
  get f () { return this.attachmentEditForm.controls; }
  get p () { return this.f.photo as FormArray; }

  ngOnInit() {
    this.authService.refreshToken();

    this.attachmentEditFormBuilder();
  
  }

  private attachmentEditFormBuilder(){
    this.attachmentEditForm = this.fb.group({
     
      photo: new FormArray([]),
    },);
    this.dataService.getAttachmentEditLis(this.currentUser.access_token,this.id).subscribe((res:any)=>{
      if (res.status === 'SUCCESS' && res.data !== null) {
        res.data.find((key:any)=>{
          if(key.editFlag===true){
            this.attachmentEditDtoList.push(key);
          }
        });
    
        for(const data of  this.attachmentEditDtoList) {
          this.p.push(this.fb.group({
            photoUpload: [null,[ Validators.required]],

          }));
        }
      
      
      }
    });
  }

  imageUploader($event: any) {
    console.log($event);
    let reader = new FileReader();
    reader.readAsDataURL($event.target.files[0]);
    console.log($event.target.files[0]);
      
    reader.onload = (_event) => { 
      this.attachmentEditDtoList[$event.target.id].photoByte = (<string>reader.result).split(',')[1];
    }

    $event.target.value = null;
    console.log(this.attachmentEditDtoList);
  


  }

submit(){
  this.submitted = true;
  this.nextLoading = true;
console.log(this.attachmentEditForm);
  if (this.attachmentEditForm.invalid) { this.nextLoading = false; return; }

  for(const data of this.attachmentEditDtoList){
    this.applicationInfoAttachmentDtoList.push({
      daApplicationInfoAttachmentId : data.daApplicationInfoAttachmentId,
      filePath : data.filePath,
      fileType: data.fileType,
      photoByte: data.photoByte,

  });
  }
  const attachmentEdit ={
    daApplicationInfoId : this.id,
    applicationInfoAttachmentDtoList: this.applicationInfoAttachmentDtoList,
  }
   
  
  this.dataService.attachmentEdit(this.currentUser.access_token, attachmentEdit).subscribe((res:any)=>{ 
    console.log(res);
    if (res.status === 'SUCCESS' && res.data === null) {
    this.router.navigate(['/inquery']);
  
  
  }
});
}
  

}
