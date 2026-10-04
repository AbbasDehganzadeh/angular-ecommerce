import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { META_URLS } from '../../META.config';

const DESCRIPTION = 'description';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  constructor(private meta: Meta, private title: Title) {}

  updateMetaTags(route: string) {
    const meta = META_URLS.get(route);
    if (meta) {
      const { title, describtion } = meta;
      this.updateTitle(title);
      this.updateDescription(describtion);
    }
  }

  private updateTitle(title: string) {
    if (title) {
      this.title.setTitle(title);
    }
  }

  private updateDescription(description: string) {
    if (description) {
      this.meta.updateTag({ name: DESCRIPTION, content: description });
    }
  }
}
