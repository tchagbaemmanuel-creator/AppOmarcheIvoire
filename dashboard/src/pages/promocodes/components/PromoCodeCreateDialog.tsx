import { useState } from "react"
import { CreatePromoCodeDTO, PromoCodeType, useCreatePromoCodeMutation } from "@/redux/api/promocode"
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
import { FaPlus } from "react-icons/fa6"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function PromoCodeCreateDialog() {
    const [createPromoCode] = useCreatePromoCodeMutation()
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState<CreatePromoCodeDTO>({
        code: "",
        amount: 0,
        discountType: "PERCENTAGE",
        expiration: "",
    })
    const [errors, setErrors] = useState<{
        code?: string;
        amount?: string;
        discountType?: string;
        expiration?: string;
    }>({})

    const validateForm = () => {
        const newErrors: typeof errors = {}

        if (!formData.code.trim()) {
            newErrors.code = "Le code est requis"
        }

        if (formData.amount <= 0) {
            newErrors.amount = formData.discountType === "PERCENTAGE"
                ? "Le pourcentage de réduction doit être supérieur à 0"
                : "Le montant de réduction doit être supérieur à 0"
        }

        if (formData.discountType === "PERCENTAGE" && formData.amount > 100) {
            newErrors.amount = "Le pourcentage de réduction ne peut pas dépasser 100%"
        }

        if (!formData.expiration) {
            newErrors.expiration = "La date d'expiration est requise"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        try {
            await createPromoCode(formData).unwrap()
            toast.success("Code promo créé avec succès")
            setIsOpen(false)
            setFormData({
                code: "",
                amount: 0,
                discountType: "PERCENTAGE",
                expiration: "",
            })
        } catch (error) {
            toast.error("Erreur lors de la création du code promo")
            console.error("Failed to create promo code:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-orange-400 hover:bg-orange-500" variant="default">
                    Ajouter un code promo
                    <FaPlus className="ml-2" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un code promo</DialogTitle>
                    <DialogDescription>
                        Remplissez tous les champs pour créer un nouveau code promo.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="code" className="text-right">
                            Code
                        </Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                            className={`col-span-3 ${errors.code ? 'border-red-500' : ''}`}
                        />
                        {errors.code && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.code}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="discountType" className="text-right">
                            Type
                        </Label>
                        <Select
                            value={formData.discountType}
                            onValueChange={(value: PromoCodeType) =>
                                setFormData(prev => ({ ...prev, discountType: value }))
                            }
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Sélectionner le type de réduction" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PERCENTAGE">Pourcentage</SelectItem>
                                <SelectItem value="FIXED">Montant fixe</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="amount" className="text-right">
                            {formData.discountType === "PERCENTAGE" ? "Réduction (%)" : "Montant (FCFA)"}
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            min="1"
                            max={formData.discountType === "PERCENTAGE" ? "100" : undefined}
                            value={formData.amount}
                            onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                            className={`col-span-3 ${errors.amount ? 'border-red-500' : ''}`}
                        />
                        {errors.amount && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.amount}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="expiration" className="text-right">
                            Date d'expiration
                        </Label>
                        <Input
                            id="expiration"
                            type="datetime-local"
                            value={formData.expiration}
                            onChange={(e) => setFormData(prev => ({ ...prev, expiration: e.target.value }))}
                            className={`col-span-3 ${errors.expiration ? 'border-red-500' : ''}`}
                        />
                        {errors.expiration && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.expiration}</p>}
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