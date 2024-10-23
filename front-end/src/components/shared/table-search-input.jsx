import React, { useCallback } from 'react';
import { Input } from '../ui/input';
import { useDebounce } from 'use-debounce';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { XIcon } from 'lucide-react';

export default function TableSearchInput({
  placeholder
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = React.useState(search);
  // debounce the search input
  const [debouncedValue] = useDebounce(searchTerm, 1000);
  const handleSettingSearchParams = useCallback((newSearchValue) => {
    // Update the URL with the new search value
    if (
      newSearchValue === '' ||
      newSearchValue === undefined ||
      !newSearchValue
    ) {
      searchParams.delete('search');
      setSearchParams(searchParams);
      return;
    }
    setSearchParams({
      ...Object.fromEntries(searchParams),
      search: newSearchValue // Update the search value
    });
  }, []);

  React.useEffect(() => {
    handleSettingSearchParams(debouncedValue);
  }, [debouncedValue, handleSettingSearchParams]);
  return (
    <>
    <Input
      placeholder={placeholder || `Search search...`}
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
      className="w-full md:max-w-sm"
    />
    {searchTerm  && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-10 px-2 lg:px-3"
            onClick={() => {
              setSearchTerm('')
            }
            }
          >

            Reset
            <XIcon className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
    </>
    
  );
}