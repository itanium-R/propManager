class PropManager {
  constructor() {
    this.prop = {};
    this.bindList = [];
  }

  /**
   * Update the property
   *
   * @param {Element} element
   * @param {string} key
   * @param {*} value
   */
  updateProp(element, key, value) {
    this.setProp(key, value);
    this.update(element, key, value);
  }

  /**
   * Set the property
   *
   * @param {string} key
   * @param {*} value
   */
  setProp(key, value) {
    const keys = key.split(".");
    const k = keys.shift();
    if (keys.length === 0) return (this.prop[k] = value);
    if (typeof this.prop[k] === "undefined") this.prop[k] = {};
    return this.setProp(keys.join("."), value);
  }

  /**
   * Get the property
   *
   * @param {string} key
   * @returns {*}
   */
  getProp(key) {
    const keys = key.split(".");
    const k = keys.shift();
    if (keys.length === 0) return this.prop[k];
    if (!this.prop[k]) return this.prop[k];
    return this.getProp(keys.join("."));
  }

  /**
   * Bind the property to an element
   *
   * @param {Element} element
   * @param {string} key
   * @param {*} options
   */
  bindProp(element, key, options = {}) {
    const eventTypes = options.eventTypes ?? ["change"];
    const bindAttribute = options.bindAttribute ?? "value";
    const getValue = options.getFn ?? (() => element[bindAttribute]);
    this.updateProp(element, key, getValue());
    for (const eventType of eventTypes) {
      element.addEventListener(eventType, () => {
        this.updateProp(element, key, getValue());
      });
    }
    this.bindList.push({
      element: element,
      key: key,
      options: options,
    });
  }

  /**
   *
   * @param {string} key
   * @param {Function} setFunction
   */
  bindFunction(key, setFunction) {
    this.bindList.push({
      element: null,
      key: key,
      options: { setFn: setFunction },
    });
  }

  /**
   * Update the element
   *
   * @param {Element} element
   * @param {string} key
   * @param {*} value
   */
  update(element, key, value) {
    const targetBindings = this.bindList.filter(
      (binding) => (!binding.element || binding.element !== element) && binding.key === key
    );
    for (const binding of targetBindings) {
      if (binding.options.setFn) {
        binding.options.setFn(value);
        continue;
      }
      const bindAttribute = binding.options.bindAttribute ?? "value";
      binding.element[bindAttribute] = value;
    }
  }
}
