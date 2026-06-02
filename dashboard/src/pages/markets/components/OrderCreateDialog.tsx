import { useState } from "react"
import { CreateOrderDTO, useCreateOrderMutation } from "@/redux/api/order"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OrderCreateDialogProps {
    marketId: string;
}

export default function OrderCreateDialog({ marketId }: OrderCreateDialogProps) {
    const [createOrder] = useCreateOrderMutation()
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState<CreateOrderDTO>({
        order: {
            userId: "",
            locationX: 0,
            locationY: 0,
            address: "",
            deliveryTime: "",
            paymentMethod: "CASH",
            status: "IDLE"
        },
        orderProducts: []
    })
    const [errors, setErrors] = useState<{
        userId?: string;
        address?: string;
        deliveryTime?: string;
    }>({})

    const validateForm = () => {
        const newErrors: typeof errors = {}

        if (!formData.order.userId.trim()) {
            newErrors.userId = "L'identifiant de l'utilisateur est requis"
        }

        if (!formData.order.address.trim()) {
            newErrors.address = "L'adresse est requise"
        }

        if (!formData.order.deliveryTime.trim()) {
            newErrors.deliveryTime = "L'heure de livraison est requise"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        try {
            await createOrder(formData).unwrap()
            toast.success("Commande créée avec succès")
            setIsOpen(false)
            setFormData({
                order: {
                    userId: "",
                    locationX: 0,
                    locationY: 0,
                    address: "",
                    deliveryTime: "",
                    paymentMethod: "CASH",
                    status: "IDLE"
                },
                orderProducts: []
            })
        } catch (error) {
            toast.error("Erreur lors de la création de la commande")
            console.error("Failed to create order:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="bg-orange-400 hover:bg-orange-500">
                    Ajouter une commande
                    <FaPlus className="ml-2" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ajouter une commande</DialogTitle>
                    <DialogDescription>
                        Remplissez tous les champs pour créer une nouvelle commande.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="userId" className="text-right">
                            Utilisateur
                        </Label>
                        <Input
                            id="userId"
                            value={formData.order.userId}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                order: { ...prev.order, userId: e.target.value }
                            }))}
                            className={`col-span-3 ${errors.userId ? 'border-red-500' : ''}`}
                        />
                        {errors.userId && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.userId}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="address" className="text-right">
                            Adresse
                        </Label>
                        <Input
                            id="address"
                            value={formData.order.address}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                order: { ...prev.order, address: e.target.value }
                            }))}
                            className={`col-span-3 ${errors.address ? 'border-red-500' : ''}`}
                        />
                        {errors.address && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.address}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="deliveryTime" className="text-right">
                            Livraison
                        </Label>
                        <Input
                            id="deliveryTime"
                            type="datetime-local"
                            value={formData.order.deliveryTime}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                order: { ...prev.order, deliveryTime: e.target.value }
                            }))}
                            className={`col-span-3 ${errors.deliveryTime ? 'border-red-500' : ''}`}
                        />
                        {errors.deliveryTime && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.deliveryTime}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="paymentMethod" className="text-right">
                            Paiement
                        </Label>
                        <Select
                            value={formData.order.paymentMethod}
                            onValueChange={(value) => setFormData(prev => ({
                                ...prev,
                                order: { ...prev.order, paymentMethod: value }
                            }))}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Sélectionnez le mode de paiement" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CASH">Espèces</SelectItem>
                                <SelectItem value="CARD">Carte</SelectItem>
                                <SelectItem value="MOBILE">Mobile</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="promoCodeId" className="text-right">
                            Code promo
                        </Label>
                        <Input
                            id="promoCodeId"
                            value={formData.order.promoCodeId || ""}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                order: { ...prev.order, promoCodeId: e.target.value || undefined }
                            }))}
                            className="col-span-3"
                            placeholder="Optionnel"
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