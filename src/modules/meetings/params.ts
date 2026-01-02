import { parseAsInteger, parseAsString } from "nuqs/server";
import { DEFAULT_PAGE } from "@/constants";
import { SearchParams } from "nuqs";
import { parseAsStringEnum } from "nuqs/server";
import { MeetingStatus } from "./types";

export const FiltersearchParams = {
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault:true}),
    search: parseAsString.withDefault("").withOptions({clearOnDefault:true}),
    status:parseAsStringEnum(Object.values(MeetingStatus)),
    agentId:parseAsString.withDefault("").withOptions({clearOnDefault:true})
};

export const loadSearchParams = async (searchParams: Promise<SearchParams> | SearchParams) => {
    const params = await Promise.resolve(searchParams);
    return {
        page: FiltersearchParams.page.parseServerSide(params.page),
        search: FiltersearchParams.search.parseServerSide(params.search),
    };
};