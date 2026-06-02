import { useState } from "react"
import { useCreateMarketMutation, AreaCode } from "@/redux/api/market"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaPlus } from "react-icons/fa"
import { FaImage } from "react-icons/fa6"
import { ImageUpload } from "@/components/ui/image-upload"

export default function MarketCreateDialog() {
    const [createMarket] = useCreateMarketMutation()
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        latitude: "0",
        longitude: "0",
        pictureUrl: undefined as string | undefined,
        areaCode: "" as AreaCode
    })
    const [errors, setErrors] = useState<{
        name?: string;
        latitude?: string;
        longitude?: string;
    }>({})

    const validateForm = () => {
        const newErrors: typeof errors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Le nom est requis"
        }

        const lat = parseFloat(formData.latitude)
        const lng = parseFloat(formData.longitude)

        if (isNaN(lat) || lat < -90 || lat > 90) {
            newErrors.latitude = "La latitude doit être entre -90 et 90"
        }

        if (isNaN(lng) || lng < -180 || lng > 180) {
            newErrors.longitude = "La longitude doit être entre -180 et 180"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        try {
            await createMarket({
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            }).unwrap()
            toast.success("Marché créé avec succès")
            setIsOpen(false)
            setFormData({
                name: "",
                latitude: "0",
                longitude: "0",
                pictureUrl: undefined,
                areaCode: "COCODY"
            })
        } catch (error) {
            toast.error("Erreur lors de la création du marché")
            console.error("Failed to create market:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="bg-orange-400 hover:bg-orange-500">
                    Ajouter un marché
                    <FaPlus className="ml-2" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un marché</DialogTitle>
                    <DialogDescription>
                        Remplissez tous les champs pour créer un nouveau marché.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label>Photo</Label>
                        <ImageUpload
                            className="col-span-3"
                            value={formData.pictureUrl}
                            onChange={(url) => setFormData({ ...formData, pictureUrl: url })}
                            onDelete={() => setFormData({ ...formData, pictureUrl: "" })}
                        />
                    </div>
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
                        {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="latitude" className="text-right">
                            Latitude
                        </Label>
                        <Input
                            id="latitude"
                            type="text"
                            inputMode="decimal"
                            pattern="-?[0-9]*[.,]?[0-9]*"
                            value={formData.latitude}
                            onChange={(e) => {
                                const value = e.target.value.replace(',', '.')
                                if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                                    setFormData(prev => ({ ...prev, latitude: value }))
                                }
                            }}
                            className={`col-span-3 ${errors.latitude ? 'border-red-500' : ''}`}
                        />
                        {errors.latitude && <span className="text-sm text-red-500">{errors.latitude}</span>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="longitude" className="text-right">
                            Longitude
                        </Label>
                        <Input
                            id="longitude"
                            type="text"
                            inputMode="decimal"
                            pattern="-?[0-9]*[.,]?[0-9]*"
                            value={formData.longitude}
                            onChange={(e) => {
                                const value = e.target.value.replace(',', '.')
                                if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                                    setFormData(prev => ({ ...prev, longitude: value }))
                                }
                            }}
                            className={`col-span-3 ${errors.longitude ? 'border-red-500' : ''}`}
                        />
                        {errors.longitude && <span className="text-sm text-red-500">{errors.longitude}</span>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="areaCode">Zone</Label>
                        <div className="col-span-3">
                        <Select
                            value={formData.areaCode}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, areaCode: value as AreaCode }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une zone" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries({
                                    ABOBO: "Abobo",
                                    ADJAME: "Adjamé",
                                    ATTECOUBE: "Attécoubé",
                                    COCODY: "Cocody",
                                    KOUMASSI: "Koumassi",
                                    MARCORY: "Marcory",
                                    PLATEAU: "Plateau",
                                    TREICHVILLE: "Treichville",
                                    YOPOUGON: "Yopougon",
                                    BROFODOUME: "Brofodoumé",
                                    BINGERVILLE: "Bingerville",
                                    PORT_BOUET: "Port-Bouët",
                                    ANYAMA: "Anyama",
                                    SONGON: "Songon"
                                }).map(([code, label]) => (
                                    <SelectItem key={code} value={code}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        </div>
                    </div>
                    <div className="grid gap-2">
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
