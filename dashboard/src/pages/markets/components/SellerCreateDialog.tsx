import { useState } from "react"
import { useCreateSellerMutation } from "@/redux/api/seller"
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
import { FaPlus, FaImage } from "react-icons/fa6"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"

interface SellerCreateDialogProps {
    marketId: string;
}

export default function SellerCreateDialog({ marketId }: SellerCreateDialogProps) {
    const [createSeller] = useCreateSellerMutation()
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        marketId,
        firstName: "",
        lastName: "",
        tableNumber: 1,
        gender: "M" as "M" | "F",
        pictureUrl: undefined as string | undefined
    })
    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        tableNumber?: string;
    }>({})

    const validateForm = () => {
        const newErrors: typeof errors = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = "Le prénom est requis"
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Le nom est requis"
        }

        if (isNaN(formData.tableNumber) || formData.tableNumber < 1) {
            newErrors.tableNumber = "Le numéro de table doit être supérieur à 0"
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
            setFormData(prev => ({ ...prev, pictureUrl: data.url }))
            toast.success("Image téléchargée avec succès")
        } catch (error) {
            toast.error("Erreur lors du téléchargement de l'image")
            console.error("Failed to upload image:", error)
        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        try {
            await createSeller(formData).unwrap()
            toast.success("Vendeur créé avec succès")
            setIsOpen(false)
            setFormData({
                marketId,
                firstName: "",
                lastName: "",
                tableNumber: 1,
                gender: "M",
                pictureUrl: undefined
            })
        } catch (error) {
            toast.error("Erreur lors de la création du vendeur")
            console.error("Failed to create seller:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="bg-orange-400 hover:bg-orange-500">
                    Ajouter un vendeur
                    <FaPlus className="ml-2" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un vendeur</DialogTitle>
                    <DialogDescription>
                        Remplissez tous les champs pour créer un nouveau vendeur.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="firstName" className="text-right">
                            Prénom
                        </Label>
                        <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            className={`col-span-3 ${errors.firstName ? 'border-red-500' : ''}`}
                        />
                        {errors.firstName && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.firstName}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="lastName" className="text-right">
                            Nom
                        </Label>
                        <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            className={`col-span-3 ${errors.lastName ? 'border-red-500' : ''}`}
                        />
                        {errors.lastName && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.lastName}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="tableNumber" className="text-right">
                            Table №
                        </Label>
                        <Input
                            id="tableNumber"
                            type="number"
                            min={1}
                            value={formData.tableNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, tableNumber: parseInt(e.target.value) }))}
                            className={`col-span-3 ${errors.tableNumber ? 'border-red-500' : ''}`}
                        />
                        {errors.tableNumber && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.tableNumber}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="gender" className="text-right">
                            Genre
                        </Label>
                        <Select
                            value={formData.gender}
                            onValueChange={(value: "M" | "F") => setFormData(prev => ({ ...prev, gender: value }))}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Sélectionnez le genre" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="M">Homme</SelectItem>
                                <SelectItem value="F">Femme</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label>Photo</Label>
                        <ImageUpload
                            value={formData.pictureUrl}
                            onChange={(url) => setFormData({ ...formData, pictureUrl: url })}
                            onDelete={() => setFormData({ ...formData, pictureUrl: "" })}
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