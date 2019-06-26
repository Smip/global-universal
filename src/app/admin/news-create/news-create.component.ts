import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Content } from '../../shared/models/content.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { ArticleService } from '../../shared/services/article.service';
import { mergeMap } from 'rxjs/operators/mergeMap';

import { QuillEditorComponent } from 'ngx-quill';
import Quill from 'quill';
import Delta from 'quill-delta';

import { ImageDrop } from 'quill-image-drop-module';
import { FilesService } from '../../shared/services/files.service';

declare const M: any;
Quill.register('modules/imageDrop', ImageDrop);

@Component({
  selector: 'global-news-create',
  templateUrl: './news-create.component.html',
  styleUrls: ['./news-create.component.scss']
})
export class NewsCreateComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  subscription2: Subscription;
  content: Content;
  lang = 'ru';
  form: FormGroup;
  modules = {};
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
    private router: Router,
    private articleService: ArticleService,
    private filesService: FilesService
  ) { }
  
  ngOnDestroy () {
    if (this.subscription) { this.subscription.unsubscribe(); }
    if (this.subscription2) { this.subscription2.unsubscribe(); }
  }
  
  ngOnInit () {
    this.content = new Content('', '', this.lang);
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
    this.form = new FormGroup({
      'lang': new FormControl('ru', [Validators.required]),
      'title': new FormControl('', [Validators.required]),
      'body': new FormControl('', [Validators.required])
    });
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
    this.subscription2 = this.filesService.addFile(fb).subscribe(event => {
      callback(event['path']);
    });
  }
  
  onSubmit () {
    let slug = '';
    const formData = this.form.value;
    this.subscription = this.articleService.createArticle('news', formData)
      .pipe(mergeMap(article => {
        slug = article.slug;
        return this.articleService.createContent(slug, formData);
      }))
      .subscribe((content: Content) => {
        this.router.navigate(['/admin', 'pages', slug, this.content.lang]);
      }, (error) => M.toast({html: 'Ошибка ' + error.status + '. Не сохранено! Повторите попытку'}));
  }
}
