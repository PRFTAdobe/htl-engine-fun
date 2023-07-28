/* eslint-disable import/no-extraneous-dependencies */
import './favicon/android-chrome-192x192.png';
import './favicon/android-chrome-512x512.png';
import './favicon/apple-touch-icon.png';
import './favicon/favicon.ico';
import './favicon/favicon-16x16.png';
import './favicon/favicon-32x32.png';
import './favicon/site.webmanifest';
import updateImageWrapper from '@/image';
import { renderMain } from './templates/core/wcm/components/image/v2/image/image.htl';
import initializeImageOptions from './image-options';
import './assets/lava-into-ocean.jpeg';
import './assets/snowy-mountain-glacier.jpeg';
import './assets/component.svg';
import './index.css';

const parseHtml = (string: string) => {
  const parser = new DOMParser();
  const updatedString = string
    .replace(/&(amp;)*lt;/g, '<')
    .replace(/&(amp;)*gt;/g, '>');
  const document = parser.parseFromString(updatedString, 'text/html');
  return document.body.firstChild;
};

document.addEventListener('DOMContentLoaded', async () => {
  const rootElement = document.body.querySelector('[id="root"]');
  const imageTemplateOne = await renderMain(
    {
      models: {
        'com.adobe.cq.wcm.core.components.models.Image': {
          areas: [],
          lazyEnabled: false,
          src: '/assets/lava-into-ocean.jpeg',
          srcUriTemplate: '/assets/lava-into-ocean.jpeg',
          uuid: '0f54e1b5-535b-45f7-a46b-35abb19dd6bc',
          widths: [],
        },
      },
    },
    {
      globals: { wcmmode: { edit: true } },
    },
  );

  const imageTemplateTwo = await renderMain(
    {
      models: {
        'com.adobe.cq.wcm.core.components.models.Image': {
          alt: 'Lava flowing into the ocean',
          areas: [],
          displayPopupTitle: false,
          lazyEnabled: false,
          src: '/assets/lava-into-ocean.jpeg',
          srcUriTemplate: '/assets/lava-into-ocean.jpeg',
          title: 'Lava flowing into the ocean',
          uuid: '0f54e1b5-535b-45f7-a46b-35abb19dd6bc',
          widths: [],
        },
      },
    },
    {
      globals: { wcmmode: { edit: true } },
    },
  );

  const imageTemplateThree = await renderMain(
    {
      models: {
        'com.adobe.cq.wcm.core.components.models.Image': {
          alt: 'Snowy mountain glacier',
          areas: [],
          displayPopupTitle: true,
          lazyEnabled: false,
          link: 'https://www.perficient.com/',
          src: '/assets/snowy-mountain-glacier.jpeg',
          srcUriTemplate: '/assets/snowy-mountain-glacier.jpeg',
          title: 'Snowy mountain glacier',
          uuid: '45c6ee92-90e1-4af2-af69-b6dcbc7daeb7',
          widths: [],
        },
      },
    },
    {
      globals: { wcmmode: { edit: true } },
    },
  );

  const imageTemplateFour = await renderMain(
    {
      models: {
        'com.adobe.cq.wcm.core.components.models.Image': {
          areas: [],
          lazyEnabled: false,
          src: '/assets/component.svg',
          srcUriTemplate: '/assets/component.svg',
          uuid: '0f54e1b5-535b-45f7-a46b-35abb19dd6bc',
          widths: [],
        },
      },
    },
    {
      globals: { wcmmode: { edit: true } },
    },
  );

  const imageElementOne = parseHtml(imageTemplateOne);
  const imageOptionsOne = initializeImageOptions(
    imageElementOne as HTMLDivElement,
  );

  const imageElementTwo = parseHtml(imageTemplateTwo);
  const imageOptionsTwo = initializeImageOptions(
    imageElementTwo as HTMLDivElement,
  );

  const imageElementThree = parseHtml(imageTemplateThree);
  const imageOptionsThree = initializeImageOptions(
    imageElementThree as HTMLDivElement,
  );

  const imageElementFour = parseHtml(imageTemplateFour);
  const imageOptionsFour = initializeImageOptions(
    imageElementFour as HTMLDivElement,
  );

  if (rootElement) {
    const container = document.createElement('div');
    container.classList.add('cmp-panel');

    const headingElementOne = document.createElement('h3');
    headingElementOne.textContent = 'Standard';
    const containerOne = container.cloneNode(true);
    const paragraphElementOne = document.createElement('p');
    paragraphElementOne.textContent =
      'Simple image with an asset referenced from DAM and no other configuration. By default, metadata for the asset (alternative text and caption) is read from DAM but can also be provided by an author.';
    containerOne.appendChild(
      updateImageWrapper(imageElementOne as HTMLDivElement, imageOptionsOne),
    );
    rootElement.append(headingElementOne, paragraphElementOne, containerOne);

    const headingElementTwo = document.createElement('h3');
    headingElementTwo.textContent = 'Caption';
    const containerTwo = container.cloneNode(true);
    const paragraphElementTwo = document.createElement('p');
    paragraphElementTwo.textContent =
      'Captions are displayed by default in a pop-up on hover but the image can also be configured so that the caption is displayed directly on the page.';
    containerTwo.appendChild(
      updateImageWrapper(imageElementTwo as HTMLDivElement, imageOptionsTwo),
    );
    rootElement.append(headingElementTwo, paragraphElementTwo, containerTwo);

    const headingElementThree = document.createElement('h3');
    headingElementThree.textContent = 'Linked';
    const containerThree = container.cloneNode(true);
    const paragraphElementThree = document.createElement('p');
    paragraphElementThree.textContent =
      'Images can be linked to internal relative AEM resources or to external absolute URLs.';
    containerThree.appendChild(
      updateImageWrapper(
        imageElementThree as HTMLDivElement,
        imageOptionsThree,
      ),
    );
    rootElement.append(
      headingElementThree,
      paragraphElementThree,
      containerThree,
    );

    const headingElementFour = document.createElement('h3');
    headingElementFour.textContent = 'SVG and GIF Images';
    const containerFour = container.cloneNode(true);
    const paragraphElementFour = document.createElement('p');
    paragraphElementFour.textContent =
      'SVG and GIF image MIME types are supported.';
    containerFour.appendChild(
      updateImageWrapper(imageElementFour as HTMLDivElement, imageOptionsFour),
    );
    rootElement.append(headingElementFour, paragraphElementFour, containerFour);
  }
});
