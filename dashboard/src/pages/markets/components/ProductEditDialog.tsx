import { useState } from "react"
import { Product, useUpdateProductMutation } from "@/redux/api/product"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FaEllipsisH, FaImage } from "react-icons/fa"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiImageUpload } from "@/components/ui/image-upload"

interface ProductEditDialogProps {
    product: Product;
}

interface FormData {
    name: string;
    description?: string;
    unit: string;
    amount: number;
    price: number;
    category: Product['category'];
    isInStock: boolean;
    pictureUrl: string[];
}

export default function ProductEditDialog({ product }: ProductEditDialogProps) {
    const [updateProduct] = useUpdateProductMutation()
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        name: product.name,
        description: product.description || "",
        price: Number(product.price),
        amount: product.amount,
        unit: product.unit,
        category: product.category as typeof product['category'],
        isInStock: product.isInStock,
        pictureUrl: product.pictureUrl || [],
    })
    const [errors, setErrors] = useState<{
        name?: string;
        price?: string;
        quantity?: string;
    }>({})

    const validateForm = () => {
        const newErrors: typeof errors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Le nom est requis"
        }

        if (formData.price <= 0) {
            newErrors.price = "Le prix doit être supérieur à 0"
        }

        if (formData.amount < 0) {
            newErrors.quantity = "La quantité doit être positive"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('YOUR_UPLOAD_ENDPOINT', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            const data = await response.json()
            setFormData(prev => ({ ...prev, pictureUrl: [data.url] }))
            toast.success("Image téléchargée avec succès")
        } catch (error) {
            toast.error("Erreur lors du téléchargement de l'image")
            console.error("Failed to upload image:", error)
        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        try {
            await updateProduct({
                productId: product.productId,
                updateData: formData
            }).unwrap()
            toast.success("Produit mis à jour avec succès")
            setIsOpen(false)
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du produit")
            console.error("Failed to update product:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <FaEllipsisH className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>Modifier le produit</DialogTitle>
                    <DialogDescription>
                        Modifier les informations du produit afin de les mettre à jour.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="name" className="text-right">
                            Nom
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className={`col-span-3 ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-start">
                        <Label htmlFor="description" className="pt-2 text-right">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="col-span-3 h-20"
                            placeholder="Description du produit (optionnel)"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="price" className="text-right">
                            Prix
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            min={0}
                            step={0.01}
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                            className={`col-span-3 ${errors.price ? 'border-red-500' : ''}`}
                        />
                        {errors.price && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.price}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="quantity" className="text-right">
                            Quantité
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            min={0}
                            value={formData.amount}
                            onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                            className={`col-span-3 ${errors.quantity ? 'border-red-500' : ''}`}
                        />
                        {errors.quantity && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.quantity}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="unit" className="text-right">
                            Unité
                        </Label>
                        <Select
                            value={formData.unit}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Sélectionnez l'unité" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="KG">Kilogramme</SelectItem>
                                <SelectItem value="DEMI_KG">Demi Kilogramme</SelectItem>
                                <SelectItem value="TAS">Tas</SelectItem>
                                <SelectItem value="SAC">Sac</SelectItem>
                                <SelectItem value="BOITE">Boite</SelectItem>
                                <SelectItem value="MORCEAUX">Morceaux</SelectItem>
                                <SelectItem value="UNIT">Unité</SelectItem>
                                <SelectItem value="AUTRE">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="category" className="text-right">
                            Catégorie
                        </Label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as Product['category'] }))}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Sélectionnez la catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Legumes">Légumes</SelectItem>
                                <SelectItem value="Fruits">Fruits</SelectItem>
                                <SelectItem value="Viandes">Viandes</SelectItem>
                                <SelectItem value="Poissons">Poissons</SelectItem>
                                <SelectItem value="Cereales">Céréales</SelectItem>
                                <SelectItem value="Tubercules">Tubercules</SelectItem>
                                <SelectItem value="Mer">Fruits de mer</SelectItem>
                                <SelectItem value="Epices">Épices</SelectItem>
                                <SelectItem value="Autres">Autres</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="pictureUrl" className="text-right">
                            Image
                        </Label>
                        <MultiImageUpload
                            values={formData.pictureUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, pictureUrl: Array.from(e) }))}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isInStock"
                            checked={formData.isInStock}
                            onCheckedChange={(checked) =>
                                setFormData(prev => ({ ...prev, isInStock: checked as boolean }))
                            }
                        />
                        <Label htmlFor="isInStock">Produit actif</Label>
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <Button type="button" variant="default" onClick={handleSubmit}>
                        Enregistrer
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Annuler
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 