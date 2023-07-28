const NS = 'cmp';
const IS = 'image';
const LAZY_THRESHOLD = 0;
const EMPTY_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const SRC_URI_TEMPLATE_WIDTH_VAR = '{.width}';

const SELECTORS = {
  self: `[data-${NS}-is="${IS}"]`,
  image: '[data-cmp-hook-image="image"]',
  map: '[data-cmp-hook-image="map"]',
  area: '[data-cmp-hook-image="area"]',
};

const LAZYLOADER = {
  cssClass: 'cmp-image__image--is-loading',
  style: {
    height: 0,
    'padding-bottom': '', // will be replaced with % ratio
  },
};

const addLazyLoader = (element: HTMLDivElement) => {
  const imageElement = element.querySelector(
    SELECTORS.image,
  ) as HTMLImageElement;

  const width = imageElement.getAttribute('width');
  const height = imageElement.getAttribute('height');

  if (width && height) {
    const ratio = (parseInt(height, 10) / parseInt(width, 10)) * 100;
    const styles = LAZYLOADER.style;

    styles['padding-bottom'] = `${ratio}%`;

    Object.entries(styles).forEach(([key, value]) => {
      // @ts-ignore
      imageElement.style[key] = value;
    });
  }
  imageElement.setAttribute('src', EMPTY_PIXEL);
  imageElement.classList.add(LAZYLOADER.cssClass);
  imageElement.dataset.lazyLoaderShowing = true.toString();
};

const unwrapNoScript = (element: HTMLDivElement) => {
  const noscript = element.querySelector('noscript');
  if (noscript) {
    const { parentElement } = noscript;
    const imageElement = element.querySelector(
      SELECTORS.image,
    ) as HTMLImageElement;
    imageElement.removeAttribute('src');
    parentElement!.insertBefore(imageElement, noscript);

    const mapElement = element.querySelector(SELECTORS.map);
    if (mapElement) {
      parentElement!.insertBefore(mapElement, noscript);
    }

    parentElement!.removeChild(noscript);
  }
};

const resizeAreas = (event: UIEvent) => {
  const imageElement = event.target as HTMLImageElement;
  const mapElement = imageElement.nextSibling as HTMLMapElement;
  const areas = mapElement.querySelectorAll(
    SELECTORS.area,
  ) as NodeListOf<HTMLAreaElement>;
  Array.from(areas).forEach((area) => {
    const { width, height } = imageElement;
    if (width && height) {
      const relcoords = area.dataset.cmpRelcoords;
      if (relcoords) {
        const relativeCoordinates = relcoords.split(',');
        const coordinates: number[] = [];

        relativeCoordinates.forEach((relativeCoordinate, index) => {
          if (index % 2 === 0) {
            coordinates.push(parseInt(relativeCoordinate, 10) * width);
          } else {
            coordinates.push(parseInt(relativeCoordinate, 10) * height);
          }
        });
        area.coords = coordinates.join(',');
      }
    }
  });
};

const getOptimalWidth = (
  imageElement: HTMLImageElement,
  imageOptions: {
    [key: string]: string | string[] | boolean | undefined;
  },
) => {
  let container = imageElement.closest('.cmp-image') as HTMLDivElement;
  let containerWidth = container.clientWidth;
  while (containerWidth === 0 && container.parentNode) {
    // @ts-ignore
    container = container.parentNode;
    containerWidth = container.clientWidth;
  }
  const optimalWidth = containerWidth * devicePixelRatio;
  const len = (imageOptions.widths as string[]).length;
  let key = 0;

  while (
    key < len - 1 &&
    parseInt((imageOptions.widths as string[])[key], 10) < optimalWidth
  ) {
    key += 1;
  }

  return (imageOptions.widths as string[])[key];
};

const removeLazyLoader = (event: UIEvent) => {
  const imageElement = event.target as HTMLImageElement;
  imageElement.classList.remove(LAZYLOADER.cssClass);
  Object.keys(LAZYLOADER.style).forEach((key) => {
    // @ts-ignore
    imageElement.style[key] = '';
  });
  // @ts-ignore
  imageElement.removeEventListener('load', removeLazyLoader);
  delete imageElement.dataset.lazyLoaderShowing;
};

const loadImage = (
  imageElement: HTMLImageElement,
  imageOptions: {
    [key: string]: string | string[] | boolean | undefined;
  },
) => {
  const hasWidths =
    imageOptions.widths && (imageOptions.widths as string[]).length > 0;
  const replacement = hasWidths
    ? `.${getOptimalWidth(imageElement, imageOptions)}`
    : '';
  const url = (imageOptions.src as string).replace(
    SRC_URI_TEMPLATE_WIDTH_VAR,
    replacement,
  );

  if (imageElement.getAttribute('src') !== url) {
    imageElement.setAttribute('src', url);
    if (!hasWidths) {
      window.removeEventListener('scroll', () => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        updateImageElement(imageElement, imageOptions);
      });
    }
  }

  if (
    imageElement.dataset.lazyLoaderShowing &&
    Boolean(imageElement.dataset.lazyLoaderShowing)
  ) {
    // @ts-ignore
    imageElement.addEventListener('load', removeLazyLoader);
  }
};

const isLazyVisible = (imageElement: HTMLImageElement) => {
  if (imageElement.parentElement!.offsetParent === null) {
    return false;
  }

  const wt = window.pageYOffset;
  const wb = wt + document.documentElement.clientHeight;
  const et = imageElement.parentElement!.getBoundingClientRect().top + wt;
  const eb = et + imageElement.parentElement!.clientHeight;

  return eb >= wt - LAZY_THRESHOLD && et <= wb + LAZY_THRESHOLD;
};

const updateImageElement = (
  imageElement: HTMLImageElement,
  imageOptions: {
    [key: string]: string | string[] | boolean | undefined;
  },
) => {
  if (imageOptions.lazy) {
    if (isLazyVisible(imageElement)) {
      loadImage(imageElement, imageOptions);
    }
  } else {
    loadImage(imageElement, imageOptions);
  }
};

const updateImageWrapper = (
  element: HTMLDivElement,
  imageOptions: {
    [key: string]: string | string[] | boolean | undefined;
  } = {},
) => {
  const imageElement = element.querySelector(
    SELECTORS.image,
  )! as HTMLImageElement;
  element.removeAttribute(`data-${NS}-is`);
  unwrapNoScript(element);
  if (imageOptions.lazy) {
    addLazyLoader(element);
  }

  const mapElement = element.querySelector(SELECTORS.map);
  if (mapElement) {
    // @ts-ignore
    imageElement.addEventListener('load', resizeAreas);
  }

  window.addEventListener('scroll', () => {
    updateImageElement(imageElement!, imageOptions);
  });
  window.addEventListener('resize', (event: UIEvent) => {
    updateImageElement(imageElement!, imageOptions);
    if (mapElement) {
      resizeAreas(event);
    }
  });
  window.addEventListener('update', () => {
    updateImageElement(imageElement!, imageOptions);
  });
  imageElement!.addEventListener('cmp-image-redraw', () => {
    updateImageElement(imageElement!, imageOptions);
  });
  updateImageElement(imageElement!, imageOptions);
  return element;
};

export default updateImageWrapper;
