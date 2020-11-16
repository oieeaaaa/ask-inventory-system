/* eslint
  jsx-a11y/no-static-element-interactions: off,
  jsx-a11y/click-events-have-key-events: off,
  jsx-a11y/interactive-supports-focus: off
*/

import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { useField } from 'formik';
import throttle from 'lodash.throttle';
import Icon from 'components/icon/icon';

const MultiSelect = ({
  name,
  accessKey = 'name',
  options = [],
  onSearch,
  updateOptions,
  ...etc
}) => {
  // states
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // refs
  const multiSelectValues = useRef();
  const input = useRef();

  // callbacks
  const closeDropdownListener = useCallback(throttle((e) => {
    if (e.target !== multiSelectValues.current) {
      setIsOpen(false);
    }
  }, 300), []);

  // custom hooks
  const [field, , helpers] = useField({ name, multiple: true });

  const handleOpen = () => {
    input.current.focus();
    setIsOpen(true);
  };

  const handleClose = () => {
    input.current.blur();
    setIsOpen(false);
  };

  const handleToggler = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const updateQuery = (val) => {
    if (onSearch) {
      onSearch(val);
    }

    setQuery(val);
  };

  const handleInput = (e) => {
    e.persist();

    updateQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    // add item on enter
    if (e.type === 'keypress' && e.key !== 'Enter') return;

    createNewValue();
    setQuery('');
  };

  const removeValue = (key) => {
    helpers.setValue(field.value.filter((value) => value[accessKey] !== key));
  };

  const createNewValue = () => {
    const isInValue = field.value.some((val) => val.name === query);

    if (!query || isInValue) return;

    const isInOptions = options.some((option) => option[accessKey] === query);

    let value = {
      name: query,
    };

    if (!isInOptions) {
      value = {
        ...value,
        isNew: true,
      };
    }

    helpers.setValue(([
      ...field.value,
      value,
    ]));

    updateQuery('');
  };

  const selectValue = (e, value) => {
    e.stopPropagation();

    // update value
    const newValue = field.value.concat(value);
    helpers.setValue(newValue);

    // clear input
    updateQuery('');

    input.current.focus();
  };

  useEffect(() => {
    window.addEventListener('click', closeDropdownListener);

    return () => window.removeEventListener('click', closeDropdownListener);
  }, []);

  return (
    <div className={`multi-select ${isOpen ? 'multi-select--open' : ''}`}>
      <div
        onClick={handleToggler}
        className="multi-select-group"
        type="button"
        role="button"
      >
        <div ref={multiSelectValues} className="multi-select-values">
          {field.value.map((value) => (
            <button
              key={value[accessKey]}
              className="multi-select__value"
              type="button"
              onClick={() => removeValue(value[accessKey])}
            >
              {value.name}
            </button>
          ))}
          <input
            {...etc}
            ref={input}
            className="multi-select__input"
            type="text"
            onKeyPress={handleKeyPress}
            onChange={handleInput}
            onBlur={field.onBlur}
            value={query}
            size={query.length || 1}
          />
        </div>
        <Icon className="multi-select__toggler" icon="chevron-down" />
      </div>
      <ul className="multi-select-list">
        {options
          .filter((option) => !field.value
            .some((value) => value[accessKey] === option[accessKey]))
          .map((option, index) => (
            <li key={option[accessKey]} className="multi-select-list__item">
              <button
                className="multi-select-list__button"
                type="button"
                onClick={(e) => selectValue(e, option)}
              >
                <span>
                  {index + 1}
                  .
                </span>
                <span>{option.name}</span>
              </button>
            </li>
          ))}
        {!options.some((option) => option[accessKey] === query) && (
          <li className="multi-select-list__item">
            <button
              className="multi-select-list__button multi-select-list__button--create"
              type="button"
              onClick={createNewValue}
            >
              <span>
                <Icon icon="plus" />
              </span>
              <span>
                Create as &rdquo;
                {query}
                &rdquo;
              </span>
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default MultiSelect;
