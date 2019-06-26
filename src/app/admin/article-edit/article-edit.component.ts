import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../shared/services/article.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Article } from '../../shared/models/article.model';
import { Content } from '../../shared/models/content.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ComponentCanDeactivate } from '../../shared/services/can-deactivate.guard';
import { QuillEditorComponent } from 'ngx-quill';
import { FilesService } from '../../shared/services/files.service';

import Quill from 'quill';
import Delta from 'quill-delta';

import { ImageDrop } from 'quill-image-drop-module';
import { concatMap, delay, retryWhen } from 'rxjs/internal/operators';
import { iif, of, throwError } from 'rxjs';

declare const M: any;

Quill.register('modules/imageDrop', ImageDrop);

@Component({
  selector: 'global-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.scss']
})
export class ArticleEditComponent implements OnInit, ComponentCanDeactivate, OnDestroy {
  
  subscription: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;
  isLoaded = false;
  slug: string;
  lang: string;
  content: Content;
  formSending = false;
  modules = {};
  form: FormGroup;
  formats = [
    'bold',
    'italic',
    'link',
    'size',
    'strike',
    'underline',
    'blockquote',
    'header',
    'indent',
    'list',
    'image'];
  
  @ViewChild('editor') editor: QuillEditorComponent;
  
  constructor (
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private filesService: FilesService
  ) { }
  
  ngOnDestroy () {
    if (this.subscription) { this.subscription.unsubscribe(); }
    if (this.subscription2) { this.subscription2.unsubscribe(); }
    if (this.subscription3) { this.subscription3.unsubscribe(); }
  }
  
  ngOnInit () {
    this.form = new FormGroup({
      'lang': new FormControl('', [Validators.required]),
      'title': new FormControl('', [Validators.required]),
      'body': new FormControl('', [Validators.required])
    });
    this.route.params.subscribe((params) => {
      this.slug = params['slug'];
      this.lang = params['lang'];
      this.isLoaded = false;
      this.load_article();
    });
    this.modules = {
      toolbar:
        [
          ['clean'],
          ['bold', 'italic', 'underline'],        // toggled buttons
          ['blockquote'],
          [{'header': 2}],               // custom button values
          [{'list': 'ordered'}, {'list': 'bullet'}],
          ['link', 'image']
        ],
      clipboard: {
        matchVisual: false
      },
      imageDrop: {handler: this.upload.bind(this)}
    };
    
  }
  
  addBindingCreated (event) {
    const toolbar = event.getModule('toolbar');
    toolbar.quill.theme.tooltip.textbox.className = 'browser-default';
    toolbar.quill.theme.tooltip.textbox.dataset.link = 'Вставьте ссылку и нажмите Enter';
    
    toolbar.quill.clipboard.addMatcher('span', (node, delta) => {
      return delta.compose(new Delta().retain(delta.length(), {color: null}));
    });
    
    toolbar.quill.clipboard.addMatcher('a', (node, delta) => {
      if (node.childNodes.length === 1 && node.firstChild.nodeName === 'IMG') {
        return delta.compose(new Delta().retain(delta.length(), {link: null, color: null, backgroudColor: null}));
      } else {
        return delta;
      }
    });
    
    toolbar.quill.clipboard.addMatcher('dl', (node, delta) => {
      return delta.compose(new Delta().retain(delta.length(), {link: null, color: null, bold: null, backgroudColor: null}));
    });
    
    toolbar.quill.clipboard.addMatcher('img', (node, delta) => {
      this.filesService.addFileFromLink(node.src).subscribe(res => {
        if (res['path']) {
          const src = node.src;
          const no = document.querySelectorAll(`[src="${src}"]`);
          (<HTMLImageElement>no[0]).src = res['path'];
        }
      });
      return new Delta().insert('\n').insert(delta.ops[delta.length() - 1].insert).insert('\n');
    });
    
    toolbar.addHandler('image', () => {
      const editor = this.editor.quillEditor;
      let fileInput = editor.container.querySelector('input[type=file]');
      if (fileInput == null) {
        fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', () => {
          if (fileInput.files != null && fileInput.files[0] != null) {
            this.upload(<File>fileInput.files[0], (link) => {
              const range = editor.getSelection(true);
              editor.insertText(range.index, '\n');
              editor.insertEmbed(range.index + 1, 'image', link);
              editor.insertText(range.index + 2, '\n');
              editor.setSelection(range.index + 3);
            });
          }
        });
        editor.container.appendChild(fileInput);
      }
      fileInput.click();
    });
  }
  
  upload (file, callback) {
    const fb = new FormData();
    fb.append('file', file, file.name);
    this.subscription3 = this.filesService.addFile(fb).subscribe(event => {
      callback(event['path']);
    });
  }
  
  load_article () {
    this.subscription = this.articleService.getArticle(this.slug, this.lang).pipe(
      retryWhen(errors => errors.pipe(
        // Use concat map to keep the errors in order and make sure they
        // aren't executed in parallel
        concatMap((e, i) => {
            M.toast({html: 'Ошибка ' + e.status + '. Повторная попытка загрузки через 3 секунды.'});
            // Executes a conditional Observable depending on the result
            // of the first argument
            return iif(
              () => i > 100,
              // If the condition is true we throw the error (the last error)
              throwError(e),
              // Otherwise we pipe this back into our stream and delay the retry
              of(e).pipe(delay(3000))
            );
          }
        )
        )
      )
    ).subscribe((article: Article) => {
      if (article.contents.length > 0 && article.contents[0].lang === this.lang) {
        this.content = article.contents[0];
      } else {
        this.content = new Content('', '', this.lang);
      }
      this.form.patchValue(this.content);
      this.isLoaded = true;
    });
  }
  
  onSubmit () {
    this.formSending = true;
    const formData = this.form.value;
    if (this.content.id) {
      this.subscription2 = this.articleService.updateContent(this.content.id, formData)
        .subscribe((content) => {
          this.content = content;
          this.formSending = false;
          M.toast({html: 'Сохранено!'});
        }, (error) => M.toast({html: 'Ошибка ' + error.status + '. Не сохранено! Повторите попытку'}));
    } else {
      this.subscription2 = this.articleService.createContent(this.slug, formData)
        .subscribe((content) => {
          this.content = content;
          this.formSending = false;
          M.toast({html: 'Сохранено!'});
        }, (error) => M.toast({html: 'Ошибка ' + error.status + '. Не сохранено! Повторите попытку'}));
    }
  }
  
  canDeactivate (): boolean | Observable<boolean> {
    if (this.form.value['title'] !== this.content['title'] || this.form.value['body'] !== this.content['body']) {
      return confirm('Ваши изменения не сохранены. Если вы перейдёте по ссылке, то изменения будут потеряны. Вы хотите покинуть страницу?');
    } else {
      return true;
    }
  }
  
}
