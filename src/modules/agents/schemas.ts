import {z} from "zod";
export const agentsInsertSchema=z.object({
    name:z.string().min(1,{message:"name is required"}),
    instructions:z.string().min(1,{message:"instructions are required"})
})
export const agentsUpdateSchema=z.object({
    id:z.string().min(1,{message:"id is required"}),
    name:z.string().min(1,{message:"name is required"}).optional(),
    instructions:z.string().min(1,{message:"instructions are required"}).optional()
})