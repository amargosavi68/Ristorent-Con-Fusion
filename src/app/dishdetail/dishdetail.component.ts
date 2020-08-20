import { Component, OnInit, ViewChild, Inject } from '@angular/core'; //we have remove Input as we used routes
import { Params, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Location } from "@angular/common";
import { Dish } from "../shared/dish";
import { Comment } from "../shared/comment";
// import { DISHES } from "../shared/dishes";
import { DishService } from "../services/dish.service";
import { switchMap, map } from 'rxjs/operators';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

     //dish = DISH;
     // @Input()
     errMess: string;
     commentForm: FormGroup;
     // comments: Dish['comments'];
     comment: Comment;
     dish: Dish;
     dishIds: string[];
     prev: string;
     next: string;

     @ViewChild('cform') commentFormDirective;

  constructor(private dishService: DishService, 
      private route: ActivatedRoute, 
      private location: Location, 
      private fb: FormBuilder,
      @Inject('BaseURL') private BaseURL) {
       this.createForm();
 }

  ngOnInit(): void {
       this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
       this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
       .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
          errmess => this.errMess = <any>errmess);
  }

     formErrors = {
       'author': '',
       'comment': '',
     };

     validationMessages = {
      'author': {
        'required':      'Author Name is required.',
        'minlength':     'Author Name must be at least 2 characters long.',
        'maxlength':     'Author Name cannot be more than 25 characters long.'
      },
      'comment': {
        'required':      'Comment is required.',
      },
     };

     createForm(){
          this.commentForm = this.fb.group({
               rating: 5,
               comment: ['',[Validators.required]],
               author: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
               date: Date(),
          });

          this.commentForm.valueChanges
             .subscribe(data => this.onValueChanged(data));

             this.onValueChanged(); // (re)set validation messages now
     }

     onValueChanged(data?: any) {
       if (!this.commentForm) { return; }
       const form = this.commentForm;
       for (const field in this.formErrors) {
         if (this.formErrors.hasOwnProperty(field)) {
           // clear previous error message (if any)
           this.formErrors[field] = '';
           const control = form.get(field);
           if (control && control.dirty && !control.valid) {
             const messages = this.validationMessages[field];
             for (const key in control.errors) {
               if (control.errors.hasOwnProperty(key)) {
                 this.formErrors[field] += messages[key] + ' ';
               }
             }
           }
         }
       }
     }

     onSubmit() {
            this.comment = this.commentForm.value;
            console.log(this.comment);
            this.dish.comments.push(this.comment);
            this.commentFormDirective.resetForm();
            this.commentForm.reset({
                 rating: 5,
                 comment: '',
                 author: '',
                 date:Date(),
            });
     }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void{
       this.location.back();
 }

}
