import { useState } from "react"
import { Product, useCreateProductMutation } from "@/redux/api/product"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
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
import { FaPlus, FaImage } from "react-icons/fa6"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiImageUpload } from "@/components/ui/image-upload"

interface ProductCreateDialogProps {
    marketId: string;
    sellerId: string;
}

interface FormData {
    name: string;
    description: string;
    unit: string;
    amount: number;
    price: number;
    category: Product['category'];
    pictureUrl: string[];
    sellerId: string;
}

export default function ProductCreateDialog({ marketId, sellerId }: ProductCreateDialogProps) {
    const [createProduct] = useCreateProductMutation()
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        name: "",
        description: "",
        unit: "",
        amount: 0,
        price: 0,
        category: "Legumes",
        pictureUrl: [],
        sellerId: sellerId,
    })
    const [errors, setErrors] = useState<{
        name?: string;
        price?: string;
        amount?: string;
    }>({})

    const validateForm = () => {
        const newErrors: typeof errors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Le nom est requis"
        }

        if (formData.price <= 0) {
            newErrors.price = "Le prix doit être supérieur à 0"
        }

        if (formData.amount <= 0) {
            newErrors.amount = "La quantité doit être supérieure à 0"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }


    const handleSubmit = async () => {
        if (!validateForm()) return

        try {
            console.log(formData.pictureUrl)
            await createProduct(formData).unwrap()
            toast.success("Produit créé avec succès")
            setIsOpen(false)
            setFormData({
                name: "",
                description: "",
                unit: "",
                amount: 0,
                price: 0,
                category: "Legumes",
                pictureUrl: [],
                sellerId: sellerId,
            })
        } catch (error) {
            toast.error("Erreur lors de la création du produit")
            console.error("Failed to create product:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="bg-orange-400 hover:bg-orange-500">
                    Ajouter un produit
                    <FaPlus className="ml-2" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un produit</DialogTitle>
                    <DialogDescription>
                        Remplissez tous les champs pour créer un nouveau produit.
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
                            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                            className={`col-span-3 ${errors.price ? 'border-red-500' : ''}`}
                        />
                        {errors.price && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.price}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="amount" className="text-right">
                            Quantité
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            min={0}
                            value={formData.amount}
                            onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                            className={`col-span-3 ${errors.amount ? 'border-red-500' : ''}`}
                        />
                        {errors.amount && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.amount}</p>}
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
                            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as "Legumes" | "Fruits" | "Viandes" | "Poissons" | "Cereales" | "Tubercules" | "Mer" | "Epices" | "Autres" }))}
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
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>
                        Ajouter
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 