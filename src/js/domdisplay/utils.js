function createElement(type, classes, options) {
  let element = document.createElement(type);
  if (classes) {
    element.className = classes;
  }
  if (options) {
    element = Object.assign(element, options);
  }
  return element;
}

export { createElement };
