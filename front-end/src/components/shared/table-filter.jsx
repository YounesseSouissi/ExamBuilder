
import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { useSearchParams } from 'react-router-dom';
import { MultipleSelector } from "../ui/multiple-selector";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { RotateCw } from "lucide-react";
export function TableFilter({ modules, chapitres, setChapitres, result, chapitresSelect, setChapitresSelect }) {
    const [moduleParams, setModuleParams] = useSearchParams();
    const module = moduleParams.get('module') || '';
    const [moduleTerm, setModuleTerm] = React.useState(module);
    const [moduleChange, setModuleChange] = React.useState();

    // debounce the module input
    const [debouncedValue] = useDebounce(moduleTerm, 1000);
    const handleSettingmoduleParams = useCallback((newmoduleValue) => {
        // Update the URL with the new module value
        if (
            newmoduleValue === '' ||
            newmoduleValue === undefined ||
            !newmoduleValue
        ) {
            moduleParams.delete('module');
            setModuleParams(moduleParams);
            return;
        }
        setModuleParams({
            ...Object.fromEntries(moduleParams),
            module: newmoduleValue // Update the module value
        });

    }, []);

    React.useEffect(() => {
        handleSettingmoduleParams(debouncedValue);
    }, [debouncedValue, handleSettingmoduleParams]);
    // debounce the chapitres input

    const values = chapitres.filter(chapitre => chapitresSelect?.includes(chapitre.value))
    React.useEffect(() => {
        if (moduleChange) {
            setChapitresSelect([])
        }

    }, [moduleChange])
    React.useEffect(() => {
        if (!module) {
            setChapitres([])
        }
    }, [module])
    return (
        <div className="bg-muted/70 rounded-md py-3 px-4 space-y-2">
            <div className=" lg:flex lg:space-x-3  xs:flex-col ">
                <div className="space-y-2">
                    <Label>Module</Label>
                    <Select onValueChange={value => { setModuleTerm(value), setModuleChange(value) }} value={module}>
                        <SelectTrigger className={'lg:w-[500px]'}>
                            <SelectValue placeholder="Select a Module" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Module</SelectLabel>
                                <SelectItem >All Module</SelectItem>
                                {modules.map(item => (
                                    <SelectItem key={item.value} value={item.value.toString()}>{item.label}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2 ">
                    <Label>Chapitres</Label>
                    {(chapitres.length > 0 && !result.isFetching) &&
                        <MultipleSelector
                            defaultOptions={chapitres}
                            options={chapitres}
                            value={values}
                            onChange={value => setChapitresSelect(value)}
                            placeholder={"Select chapitre you like..."}
                            className={'lg:w-[600px]'}
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                    no results found.
                                </p>
                            }
                        />
                    }
                    {(!chapitres.length > 0 || result.isFetching) &&
                        <MultipleSelector
                            disabled={result.isFetching}
                            className={'lg:w-[600px]'}
                            placeholder={result.isFetching ? "Chargement en cours..." : "Select chapitre you like..."}
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                    no results found.
                                </p>
                            }
                        />
                    }
                </div>
            </div>
            <Button

                onClick={() => setModuleTerm()
                }
                className={'bg-yellow-400 hover:bg-yellow-300'}
            >
                <RotateCw className="mr-2" />  Reset
            </Button>
        </div>

    )
}
