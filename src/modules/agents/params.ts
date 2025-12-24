import { parseAsInteger, parseAsString } from "nuqs/server";
import { DEFAULT_PAGE } from "@/constants";
import { SearchParams } from "nuqs";

export const FiltersearchParams = {
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault:true}),
    search: parseAsString.withDefault("").withOptions({clearOnDefault:true})
};

export const loadSearchParams = async (searchParams: Promise<SearchParams> | SearchParams) => {
    const params = await Promise.resolve(searchParams);
    return {
        page: FiltersearchParams.page.parseServerSide(params.page),
        search: FiltersearchParams.search.parseServerSide(params.search),
    };
};