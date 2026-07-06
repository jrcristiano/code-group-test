import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { KeyboardEvent } from 'react';
import { Icons } from './Icons';

export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
  keywords?: string[];
}

export interface SearchableSelectProps<T extends string = string> {
  label: string;
  placeholder: string;
  value: T | '';
  options: SelectOption<T>[];
  onChange: (value: T | '') => void;
  onClear?: () => void;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  ariaLabel?: string;
  error?: string;
  id?: string;
}

type DisplayOption<T extends string> = SelectOption<T> | {
  label: string;
  value: '';
  keywords?: string[];
};

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

export function SearchableSelect<T extends string>({
  label,
  placeholder,
  value,
  options,
  onChange,
  onClear,
  disabled = false,
  loading = false,
  emptyMessage = 'Nenhuma opção encontrada',
  className,
  ariaLabel,
  error,
  id,
}: SearchableSelectProps<T>) {
  const generatedId = useId();
  const inputId = id ?? `searchable-select-${generatedId}`;
  const listboxId = `${inputId}-listbox`;
  const errorId = `${inputId}-error`;
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedOption = options.find((option) => option.value === value);
  const allOption = useMemo<DisplayOption<T>>(
    () => ({ label: placeholder, value: '' }),
    [placeholder],
  );

  const filteredOptions = useMemo(() => {
    if (loading) return [];
    const normalizedQuery = normalize(query);
    const availableOptions: DisplayOption<T>[] = [allOption, ...options];
    if (!normalizedQuery) return availableOptions;

    return availableOptions.filter((option) => {
      const searchableText = [option.label, ...(option.keywords ?? [])]
        .map(normalize)
        .join(' ');
      return searchableText.includes(normalizedQuery);
    });
  }, [allOption, loading, options, query]);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
    setQuery('');
  }, []);

  const open = () => {
    if (disabled) return;
    setQuery('');
    setIsOpen(true);
    const selectedIndex = value
      ? options.findIndex((option) => option.value === value) + 1
      : 0;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [close, isOpen]);

  useEffect(() => {
    if (disabled) close();
  }, [close, disabled]);

  useEffect(() => {
    if (activeIndex < filteredOptions.length) return;
    setActiveIndex(filteredOptions.length ? 0 : -1);
  }, [activeIndex, filteredOptions.length]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    const activeOption = document.getElementById(`${listboxId}-option-${activeIndex}`);
    activeOption?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex, isOpen, listboxId]);

  const selectOption = (option: DisplayOption<T>) => {
    onChange(option.value);
    setQuery('');
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const clearSelection = () => {
    onChange('');
    onClear?.();
    setQuery('');
    setIsOpen(true);
    setActiveIndex(0);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab') {
      close();
      return;
    }

    if (event.key === 'Escape') {
      if (isOpen) {
        event.preventDefault();
        close();
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) {
        open();
        return;
      }
      setActiveIndex((current) => filteredOptions.length
        ? (current + 1 + filteredOptions.length) % filteredOptions.length
        : -1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        open();
        return;
      }
      setActiveIndex((current) => filteredOptions.length
        ? (current - 1 + filteredOptions.length) % filteredOptions.length
        : -1);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (!isOpen) {
        open();
        return;
      }
      const activeOption = filteredOptions[activeIndex];
      if (activeOption) selectOption(activeOption);
    }
  };

  const inputValue = isOpen ? query : selectedOption?.label ?? '';
  const activeDescendant = isOpen && activeIndex >= 0 && filteredOptions[activeIndex]
    ? `${listboxId}-option-${activeIndex}`
    : undefined;

  return (
    <div className={['form-field', 'searchable-select', className].filter(Boolean).join(' ')} ref={rootRef}>
      <label className="form-field__label" htmlFor={inputId}>{label}</label>
      <div className="searchable-select__control">
        <input
          ref={inputRef}
          id={inputId}
          className="input searchable-select__input"
          type="text"
          role="combobox"
          aria-label={ariaLabel}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={activeDescendant}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          aria-busy={loading}
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={inputValue}
          onFocus={open}
          onClick={() => {
            if (!isOpen) open();
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
        />

        {value && !disabled && !loading && (
          <button
            className="searchable-select__clear"
            type="button"
            aria-label={`Limpar filtro de ${label.toLocaleLowerCase('pt-BR')}`}
            onClick={clearSelection}
          >
            <Icons.Close size={14} />
          </button>
        )}

        <span
          className={`searchable-select__chevron${isOpen ? ' is-open' : ''}`}
          aria-hidden="true"
        >
          <Icons.ChevronsUpDown size={16} />
        </span>
      </div>

      {isOpen && (
        <ul
          id={listboxId}
          className="searchable-select__listbox"
          role="listbox"
          aria-label={`Opções de ${label.toLocaleLowerCase('pt-BR')}`}
        >
          {loading ? (
            <li className="searchable-select__message" role="status">
              Carregando opções...
            </li>
          ) : filteredOptions.length ? (
            filteredOptions.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;
              return (
                <li
                  id={`${listboxId}-option-${index}`}
                  className={`searchable-select__option${isActive ? ' is-active' : ''}${isSelected ? ' is-selected' : ''}`}
                  key={option.value || '__all__'}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseMove={() => setActiveIndex(index)}
                  onClick={() => selectOption(option)}
                >
                  <span className="searchable-select__option-label">{option.label}</span>
                  {isSelected && <Icons.Check size={16} />}
                </li>
              );
            })
          ) : (
            <li className="searchable-select__message" role="status">
              {emptyMessage}
            </li>
          )}
        </ul>
      )}

      {error && <span className="form-field__error" id={errorId} role="alert">{error}</span>}
    </div>
  );
}
