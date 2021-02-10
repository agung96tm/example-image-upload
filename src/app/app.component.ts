import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IMessage } from './message.model';


/**
 * used as entity, when proses update happens
 */
const EXAMPLE_DATA: IMessage = {
  email: 'fernando@martinez.com',
  message: 'I love my memory',
  image: 'https://www.gtavision.com/images/content/vc_radio/emotion.gif',
};

/**
 * delete empty value of object
 * ex: { name: 'agung96tm', message: 'come here man !!!', image: ''}
 * result: { name: 'agung96tm', message: 'come here man !!!' }
 */
const removeEmptyValue = (obj: object): object => {
  return Object.entries(obj).reduce((a, [k, v]) => (v ? (a[k] = v, a) : a), {});
};

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>

    <div class="section">

      <div class="container">

        <div class="mb-5">
          <div class="columns">
            <div class="column is-6 is-offset-3">
              <h1 class="title has-text-centered">
                Example Simple:<br /> "How to Handle Image"
              </h1>
            </div>
          </div>
        </div>

        <div class="columns is-multiline">
          <div class="column is-6">
            <form [formGroup]="form" (submit)="onSubmit()">
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input class="input" type="email" [formControl]="email" placeholder="Your Email">
                </div>
              </div>

              <div class="field">
                <label class="label">Message</label>
                <div class="control">
                  <input class="input" type="text" [formControl]="message" placeholder="Your Message">
                </div>
              </div>

              <div class="field">
                <label class="label">Image</label>
                <div class="control">
                  <div style="margin: 5px 0" *ngIf="imageHelpers.base64 || imageHelpers.url">
                    <img style="max-height: 128px; max-width: 128px;"
                         [src]="imageHelpers.base64 || imageHelpers.url">
                  </div>
                  <div class="file">
                    <label class="file-label">
                      <input class="file-input"
                             type="file" name="image"
                             [formControl]="image"
                             (change)="onImageChange($event)">
                      <span class="file-cta">
                          <span class="file-label">Choose a file…</span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <button type="submit" class="button is-link">Submit</button>
                </div>
              </div>
            </form>
          </div>

          <div class="column is-6">
            <div>
              <div class="mb-5">
                <button class="button is-small is-info" (click)="onToggleInstance()">
                  {{ entity ? 'set as create' : 'set as update' }}
                </button>
              </div>

              <div>
                <div class="subtitle is-5 is-marginless">Form</div>
                <div>{{ form.value | json }}</div>
              </div>

              <hr class="my-3">

              <div class="mb-2">
                <div class="subtitle is-5 is-marginless">image</div>
                <div>{{ imageHelpers | json }}</div>
              </div>

              <hr class="my-3">

              <div>
                <div class="subtitle is-5 is-marginless">Send to API</div>
                <div>{{ result | json }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [``]
})
export class AppComponent implements OnInit {
  form: FormGroup;
  entity: IMessage;

  result = null;

  imageHelpers = {
    base64: '',
    url: '',
    changed: false,
    isUpdate: false,
  };

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    // fill entity with data want to be updated
    // this.entity = EXAMPLE_DATA;

    this.form = this.fb.group({
      email: [this.entity?.email ?? null, [Validators.required, Validators.email]],
      message: [this.entity?.message ?? null, [Validators.required]],
      image: [null]
    });
    this.initImage(this.entity);
  }

  get email(): FormControl { return this.form.get('email') as FormControl; }
  get message(): FormControl { return this.form.get('message') as FormControl; }
  get image(): FormControl { return this.form.get('image') as FormControl; }

  get formValue(): any {
    const formValue = {
      ...this.form.value,
      image: this.imageHelpers.base64
    };
    return removeEmptyValue(formValue);
  }

  onSubmit(): void {
    if (this.form.valid) {
      // if (this.entity)
      // { this.service.mustBeCreateNew(this.formValue) }
      // else
      // { this.service.mustBeUpdateEntity(this.entity.id, this.formValue) }
      this.result = this.formValue;
      alert('success');
    } else {
      alert('invalid');
    }
  }

  /**
   * initialize to handle image
   */
  initImage(entity?: IMessage): void {
    if (entity?.image) {
      this.imageHelpers.url = entity.image;
      this.imageHelpers.isUpdate = true;
    } else {
      // are you sure need image as required ??
      this.image.setValidators(Validators.required);
    }
  }

  /**
   * transform file to base64
   */
  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageHelpers.base64 = reader.result as string;
        this.imageHelpers.changed = true;
      };
      reader.readAsDataURL(file);
    }
  }


  /**
   * its just helper to toggle proses create or update
   */
  onToggleInstance(): void {
    this.clearImageData();
    this.entity = this.entity ? null : EXAMPLE_DATA;
    this.ngOnInit();
  }

  clearImageData(): void {
    this.imageHelpers = {
      base64: '',
      url: '',
      changed: false,
      isUpdate: false,
    };
  }
}
