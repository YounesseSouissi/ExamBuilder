import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from './command';
import { Command as CommandPrimitive,useCommandState  } from 'cmdk';
import { Badge } from './badge';
import { cn } from '../../lib/utils';
import { useDebounce } from 'use-debounce';
const transToGroupOption = (options, groupBy) => {
    if (options.length === 0) {
        return {};
    }
    if (!groupBy) {
        return {
            '': options,
        };
    }

    const groupOption = {};
    options.forEach((option) => {
        const key = option[groupBy] || '';
        if (!groupOption[key]) {
            groupOption[key] = [];
        }
        groupOption[key].push(option);
    });
    return groupOption;
};
const removePickedOption = (groupOption, picked) => {
    const cloneOption = JSON.parse(JSON.stringify(groupOption));

    for (const [key, value] of Object.entries(cloneOption)) {
        cloneOption[key] = value.filter((val) => !picked.find((p) => p.value === val.value));
    }
    return cloneOption;
};
const CommandEmpty = forwardRef(
    ({ className, ...props }, forwardedRef) => {
        const render = useCommandState((state) => state.filtered.count === 0);

        if (!render) return null;

        return (
            <div
                ref={forwardedRef}
                className={cn('py-6 text-center text-sm', className)}
                cmdk-empty=""
                role="presentation"
                {...props}
            />
        );
    }
);

CommandEmpty.displayName = 'CommandEmpty';

export const MultipleSelector = forwardRef(({
    value,
    onChange,
    placeholder,
    defaultOptions = [],
    options: arrayOptions,
    delay,
    onSearch,
    loadingIndicator,
    emptyIndicator,
    maxSelected = Number.MAX_SAFE_INTEGER,
    onMaxSelected,
    hidePlaceholderWhenSelected,
    disabled,
    groupBy,
    className,
    badgeClassName,
    selectFirstItem = true,
    creatable = false,
    triggerSearchOnFocus = false,
    commandProps,
    inputProps,
}, ref) => {
    const inputRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [selected, setSelected] = useState(value || []);
    const [options, setOptions] = useState(
        transToGroupOption(defaultOptions, groupBy)
    );
    const [inputValue, setInputValue] = useState('');

    const debouncedSearchTerm = useDebounce(inputValue, delay || 500);
    useEffect(() => {
        if (value) {
            setSelected(value);
        }
    }, [value]);

    useEffect(() => {
        if (!arrayOptions || onSearch) {
            return;
        }
        const newOption = transToGroupOption(arrayOptions || [], groupBy);
        if (JSON.stringify(newOption) !== JSON.stringify(options)) {
            setOptions(newOption);
        }
    }, [defaultOptions, arrayOptions, groupBy, onSearch, options]);

    useEffect(() => {
        const doSearch = async () => {
            setIsLoading(true);
            const res = await onSearch?.(debouncedSearchTerm);
            setOptions(transToGroupOption(res || [], groupBy));
            setIsLoading(false);
        };

        const exec = async () => {
            if (!onSearch || !open) return;

            if (triggerSearchOnFocus) {
                await doSearch();
            }

            if (debouncedSearchTerm) {
                await doSearch();
            }
        };

        void exec();
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

    const handleUnselect = (option) => {
        const newOptions = selected.filter((s) => s.value !== option.value);
        setSelected(newOptions);
        onChange?.(newOptions.map(option=>option.value));
    };

    const handleKeyDown = (e) => {
        const input = inputRef.current;
        if (input) {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (input.value === '' && selected.length > 0) {
                    handleUnselect(selected[selected.length - 1]);
                }
            }
            if (e.key === 'Escape') {
                input.blur();
            }
        }
    };

    const CreatableItem = () => {
        if (!creatable) return undefined;

        const Item = (
            <CommandItem
                value={inputValue}
                className="cursor-pointer"
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onSelect={(value) => {
                    if (selected.length >= maxSelected) {
                        onMaxSelected?.(selected.length);
                        return;
                    }
                    setInputValue('');
                    const newOptions = [...selected, { value, label: value }];
                    setSelected(newOptions);
                    onChange?.(newOptions.map(option=>option.value));
                }}
            >{`Create "${inputValue}"`}</CommandItem>
        );

        if (!onSearch && inputValue.length > 0) {
            return Item;
        }

        if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
            return Item;
        }

        return undefined;
    };

    const EmptyItem = () => {
        if (!emptyIndicator) return undefined;

        if (onSearch && !creatable && Object.keys(options).length === 0) {
            return (
                <CommandItem value="-" disabled>
                    {emptyIndicator}
                </CommandItem>
            );
        }

        return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
    };

    const selectables = useMemo(
        () => removePickedOption(options, selected),
        [options, selected]
    );

    const commandFilter = () => {
        if (commandProps?.filter) {
            return commandProps.filter;
        }

        if (creatable) {
            return (value, search) => {
                return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
            };
        }
        return undefined;
    };

    return (
        <Command
            {...commandProps}
            onKeyDown={(e) => {
                handleKeyDown(e);
                commandProps?.onKeyDown?.(e);
            }}
            className={cn('overflow-visible bg-transparent', commandProps?.className)}
            shouldFilter={
                commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch
            }
            filter={commandFilter()}
        >
            <div
                className={cn(
                    'group rounded-md h-10 border bg-white dark:bg-background border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
                    className,
                )}
            >
                <div className="flex flex-wrap gap-1">
                    {selected.map((option) => {
                        return (
                            <Badge
                                key={option.value}
                                className={cn(
                                    'data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground',
                                    'data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground',
                                    badgeClassName,
                                )}
                                data-fixed={option.fixed}
                                data-disabled={disabled}
                            >
                                {option.label}
                                <button
                                    className={cn(
                                        'ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2',
                                        (disabled || option.fixed) && 'hidden',
                                    )}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleUnselect(option);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleUnselect(option)}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        );
                    })}
                    <CommandPrimitive.Input
                        {...inputProps}
                        ref={inputRef}
                        value={inputValue}
                        disabled={disabled}
                        onValueChange={(value) => {
                            setInputValue(value);
                            inputProps?.onValueChange?.(value);
                        }}
                        onBlur={(event) => {
                            setOpen(false);
                            inputProps?.onBlur?.(event);
                        }}
                        onFocus={(event) => {
                            setOpen(true);
                            triggerSearchOnFocus && onSearch?.(debouncedSearchTerm);
                            inputProps?.onFocus?.(event);
                        }}
                        placeholder={hidePlaceholderWhenSelected && selected.length !== 0 ? '' : placeholder}
                        className={cn(
                            'ml-2 flex-1 bg-transparent outline-none placeholder:text-black dark:placeholder:text-white',
                            inputProps?.className,
                        )}
                    />
                </div>
            </div>
            <div className="relative mt-2">
                {open && (
                    <CommandList className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                        {isLoading ? (
                            <>{loadingIndicator}</>
                        ) : (
                            <>
                                {EmptyItem()}
                                {CreatableItem()}
                                {!selectFirstItem && <CommandItem value="-" className="hidden" />}
                                {Object.entries(selectables).map(([key, dropdowns]) => (
                                    <CommandGroup key={key} heading={key} className="h-full overflow-auto">
                                        <>
                                            {dropdowns.map((option) => {
                                                return (
                                                    <CommandItem
                                                        key={option.value}
                                                        value={option.value}
                                                        disabled={option.disable}
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                        onSelect={() => {
                                                            if (selected.length >= maxSelected) {
                                                                onMaxSelected?.(selected.length);
                                                                return;
                                                            }
                                                            setInputValue('');
                                                            const newOptions = [...selected, option];
                                                            setSelected(newOptions);
                                                            onChange?.(newOptions.map(option=>option.value));
                                                        }}
                                                        className={cn(
                                                            'cursor-pointer',
                                                            option.disable && 'cursor-default text-muted-foreground',
                                                        )}
                                                    >
                                                        {option.label}
                                                    </CommandItem>
                                                );
                                            })}
                                        </>
                                    </CommandGroup>
                                ))}
                            </>
                        )}
                    </CommandList>
                )}
            </div>
        </Command>
    );
});

MultipleSelector.displayName = 'MultipleSelector';
