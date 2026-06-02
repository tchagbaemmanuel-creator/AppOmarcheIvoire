import React, { useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useUploadImageMutation, useDeleteImageMutation } from "@/redux/api/image";

interface ImageUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    value?: string;
    onChange?: (url: string) => void;
    onDelete?: () => void;
    className?: string;
}

export function ImageUpload({ value, onChange, onDelete, className, ...props }: ImageUploadProps) {
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
    const [deleteImage, { isLoading: isDeleting }] = useDeleteImageMutation();

    const handleFileChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);

            try {
                const result = await uploadImage(formData).unwrap();
                onChange?.(`${import.meta.env.VITE_API_URL}${result.url}`);
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        },
        [uploadImage, onChange]
    );

    const handleDelete = useCallback(async () => {
        if (!value) return;

        try {
            const imageId = value.split("/").pop();
            if (imageId) {
                await deleteImage(imageId).unwrap();
                onDelete?.();
            }
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    }, [value, deleteImage, onDelete]);

    return (
        <div
            className={cn(
                "relative flex items-center justify-center w-full min-h-[200px] rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors",
                !value && "hover:border-muted-foreground/50",
                className
            )}
            {...props}
        >
            {value ? (
                <>
                    <img
                        src={value}
                        alt="Uploaded"
                        className="object-contain w-full h-[200px] rounded-lg"
                    />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <X className="w-4 h-4" />
                        )}
                    </Button>
                </>
            ) : (
                <label className="flex flex-col justify-center items-center w-full h-full cursor-pointer">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading}
                    />
                    {isUploading ? (
                        <div className="flex flex-col gap-2 items-center">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Uploading...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 items-center">
                            <ImagePlus className="w-8 h-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                Click or drag image to upload
                            </span>
                        </div>
                    )}
                </label>
            )}
        </div>
    );
}

interface MultiImageUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    values?: string[];
    onChange?: (urls: string[]) => void;
    maxImages?: number;
    className?: string;
}

export function MultiImageUpload({ 
    values = [], 
    onChange, 
    maxImages = 3,
    className,
    ...props 
}: MultiImageUploadProps) {
    const handleImageChange = useCallback((url: string, index: number) => {
        const newValues = [...values];
        newValues[index] = url;
        onChange?.(newValues.filter(Boolean));
    }, [values, onChange]);

    const handleImageDelete = useCallback((index: number) => {
        const newValues = [...values];
        newValues.splice(index, 1);
        onChange?.(newValues);
    }, [values, onChange]);

    return (
        <div className="grid grid-cols-1 gap-4 w-[600px] sm:grid-cols-2 md:grid-cols-3 ">
            {[...Array(Math.min(values.length + 1, maxImages))].map((_, index) => (
                <ImageUpload
                    key={index}
                    value={values[index]}
                    onChange={(url) => handleImageChange(url, index)}
                    onDelete={() => handleImageDelete(index)}
                    className={cn(
                        "w-full min-h-[150px]",
                        className
                    )}
                />
            ))}
        </div>
    );
}
