import { ReactNode, useState } from "react";
import { ChevronsUpDownIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
    CommandInput,
    CommandItem,
    CommandList,
    CommandResponsiveDialog
} from "@/components/ui/command";
import { CommandEmpty } from "cmdk";
interface Props{
    options:Array<{
        id:string;
        value:string;
        children:ReactNode;
    }>;
    onSelect:(value:string)=>void;
    onSearch?: (value:string)=>void;
    value:string;
    placeholder?:string;
    isSearchable?:boolean;
    className?:string;
    title?:string;
    description?:string;
};
export const CommandSelect = ({
    options,
    onSelect,
    onSearch,
    value,
    placeholder = "Select an option",
    className,
    title,
    description
}: Props) => {
    const [open, setopen] = useState(false);
    const selectedOption = options.find((option) => option.value === value);
    return (
        <div>
            <Button
            onClick={()=>setopen(true)}
                type="button"
                variant="outline"
                className={cn(
                    "h-9 justify-between font-normal px-2",
                    !selectedOption && "text-muted-foreground",
                    className
                )}
            >
                <div>
                    {selectedOption?.children ?? placeholder}
                </div>
                <ChevronsUpDownIcon />
            </Button>
            <CommandResponsiveDialog
                shouldFilter={!onSearch}
                open={open}
                onOpenChange={setopen}
                title={title}
                description={description}
            >
                <CommandInput
                    placeholder="Search options..."
                    onValueChange={onSearch}
                />
                <CommandList>
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">
                            No options found.
                        </span>
                    </CommandEmpty>
                    {options.map((option) => (
                        <CommandItem
                            key={option.id}
                            onSelect={() => {
                                onSelect(option.value);
                                setopen(false);
                            }}
                        >
                            {option.children}
                        </CommandItem>
                    ))}
                </CommandList>
            </CommandResponsiveDialog>
        </div>
    );
};