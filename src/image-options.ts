const NS = 'cmp';
const IS = 'image';

const PROPERTIES: {
  [key: string]: {
    default?: string[] | boolean;
    transform?: (value: string | null | undefined) => string[] | boolean;
  };
} = {
  widths: {
    default: [],
    transform(value) {
      const widths: string[] = [];
      if (typeof value === 'string') {
        value.split(',').forEach((item) => {
          if (!Number.isNaN(Number(item))) {
            widths.push(item);
          }
        });
      }
      return widths;
    },
  },
  lazy: {
    default: false,
    transform(value) {
      return !(value === null || typeof value === 'undefined');
    },
  },
  src: {},
};

const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const extractImageOptions = (element: HTMLDivElement) => {
  const imageOptions: { [key: string]: string | undefined } = {};
  const reserved = ['is', `hook${capitalize(IS)}`];
  const { dataset } = element;
  Object.entries(dataset).forEach(([key, value]) => {
    if (key.indexOf(NS) === 0) {
      let optionsKey = key.slice(NS.length);
      optionsKey = optionsKey.charAt(0).toLowerCase() + optionsKey.substring(1);

      if (reserved.indexOf(optionsKey) === -1) {
        imageOptions[optionsKey] = value;
      }
    }
  });
  return imageOptions;
};

const updateImageOptions = (imageOptions: {
  [key: string]: string | undefined;
}) => {
  const updatedOptions: {
    [key: string]: string | string[] | boolean | undefined;
  } = {};
  Object.entries(PROPERTIES).forEach(([key, value]) => {
    if (imageOptions && imageOptions[key] != null) {
      if (value && typeof value.transform === 'function') {
        updatedOptions[key] = value.transform(imageOptions[key]);
      } else {
        updatedOptions[key] = imageOptions[key];
      }
    } else {
      updatedOptions[key] = value.default;
    }
  });
  return updatedOptions;
};

const initializeImageOptions = (element: HTMLDivElement) => {
  const imageOptions = extractImageOptions(element);
  return updateImageOptions(imageOptions);
};

export default initializeImageOptions;
