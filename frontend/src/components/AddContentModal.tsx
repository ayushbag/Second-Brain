import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { z } from 'zod'


const AddContentModal = ({ toggleModal }: {
    toggleModal: (value: boolean) => void 
}) => {

    const [title, setTitle] = useState<string>("")
    const [link, setLink] = useState<string>("")
    const [tags, setTags] = useState<string>("")

    const queryClient = useQueryClient();

    const contentSchema = z.object({
        title: z.string().min(1, "Minimum 1 Character Required"),
        link: z.string().min(1, "Enter a valid link"),
        tags: z.string().transform((str) => str.split(",").map((s) => s.trim()))
            .refine((arr) => arr.length > 0, {
                message: "List cannot be empty",
            })
            .refine((arr) => arr.every((item) => item.length > 0), {
                message: "Items cannot be empty",
            })
    })

    const postContent = async (data: { title: string, link: string, tags: string[] }) => {
        const token = localStorage.getItem("Authorization");
        const response = await axios.post("http://localhost:3000/content", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data
    }
    
    const mutation = useMutation({
        mutationFn: postContent,
        onSuccess: () => {
            toast.success("Content added successfully!")
            queryClient.invalidateQueries({ queryKey: ["content"] })
        },
        onError: () => {
            toast.error("Failed to add content")
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const result = contentSchema.parse({ title, link, tags })
            mutation.mutate(result)
            toggleModal(false)
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.errors.forEach((err) => {
                    toast.error(err.message)
                })
            }
        }
    }

  return (
    <div className="fixed z-50 inset-0 bg-zinc-950/70 flex items-center justify-center h-screen w-screen">
        <div className="bg-zinc-900 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md font-mona relative">
            <button
                className="absolute top-4 right-4 text-xl text-zinc-400 hover:text-zinc-200"
                onClick={() => {toggleModal(false)}}
            >
                &times;
            </button>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">Add Content</h2>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3">
                    <label htmlFor="name" className="text-sm text-zinc-200">Title</label>
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        id="name"
                        className="rounded-md p-2 bg-zinc-800 focus:ring-2 focus:ring-violet-500 focus:outline-none w-full placeholder:text-sm"
                        placeholder="Enter Content Title"
                    />
                    <label htmlFor="link" className="text-sm text-zinc-200">Link</label>
                    <input
                        onChange={(e) => setLink(e.target.value)}
                        type="text"
                        id="link"
                        className="rounded-md p-2 bg-zinc-800 focus:ring-2 focus:ring-violet-500 focus:outline-none w-full placeholder:text-sm"
                        placeholder="Paste your link here"
                    />
                    <label htmlFor="tags" className="text-sm text-zinc-200">Tags</label>
                    <input
                        onChange={(e) => setTags(e.target.value)}
                        type="text"
                        id="tags"
                        className="rounded-md p-2 bg-zinc-800 focus:ring-2 focus:ring-violet-500 focus:outline-none w-full placeholder:text-sm"
                        placeholder="Enter tags separated by commas"
                    />
                    <button type="submit" className="bg-gradient-to-b from-violet-700 to-purple-600 text-white rounded-md p-2 mt-3">
                        Add Content
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default AddContentModal;
