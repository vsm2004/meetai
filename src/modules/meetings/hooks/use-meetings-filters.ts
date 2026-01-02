import { DEFAULT_PAGE } from "@/constants";
import { MeetingStatus } from "../types";
import {parseAsInteger, parseAsString,useQueryStates,parseAsStringEnum} from "nuqs";
import { object } from "better-auth";
export const useMeetingsFilters=() => {
    return useQueryStates({
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault:true}),
        search: parseAsString.withDefault("").withOptions({clearOnDefault:true}),
        status:parseAsStringEnum(Object.values(MeetingStatus)),
        agentId:parseAsString.withDefault("").withOptions({clearOnDefault:true})
    });
}
