import { useAutocomplete } from "@/app/hooks/useAutocomplete";
import React, { useEffect, useState } from "react";

type OwnOpts = {
    throttle?: number
    data: any[]
    initialValue?: string;
    disabled?: boolean;
    dataProvider?: (query: string) => any[] | Promise<any[]>
    dataTransformer?: (query: string) => { label: string, value: any }
    onSelect?: (value: any) => any
};

const noTransform = (x: any) => x;

const DataListOption = (props: {value: any}) => {
    const { value }= props;
    if (typeof value === 'string') {
        return <option value={value} />
    }
    return <option value={value.value}>{value.label}</option>
}

export const Combo = (opts: OwnOpts) => {
    const {initialValue} = opts;
    const {query, result, setQuery} = useAutocomplete(opts.data || [], {
        thorttle: opts.throttle || 150,
        initialQuery: initialValue,
        dataProvider: opts.dataProvider
    });

    useEffect(() => {
        if (initialValue) setQuery(initialValue);
    }, [initialValue])

    const transformer = opts.dataTransformer || noTransform;

    const [randomId] = useState(Math.random());
    const dataListId = 'combo_' + randomId;

    const handleSelect = (e: React.SyntheticEvent) => {
        console.log(e.nativeEvent.type);
        if(e.nativeEvent.type === 'submit' || e.nativeEvent.type === 'focusout') {
            e.preventDefault();
            opts.onSelect?.(query);
        }
    }
    
    /**
     * <form> wrapper is required, as React does not interact well
     * with the native datalist and does not receive change events correctly
     */

    return <>
        <form style={{display: 'inline'}} onChange={handleSelect} onSubmit={handleSelect} onBlur={handleSelect}>
        <input disabled={opts.disabled} type="text" list={dataListId} value={query}
            onInput={e => setQuery((e.target as HTMLInputElement).value)}/>
        <datalist id={dataListId}>
            {result.map(item => <DataListOption key={item} value={transformer(item)} />)}
        </datalist>
        </form>
    </>
}