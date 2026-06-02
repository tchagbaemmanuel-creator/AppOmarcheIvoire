import { useState } from "react"
import { Order, UpdateOrderStatusDTO, useUpdateOrderStatusMutation } from "@/redux/api/order"
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
import { FaEllipsisH } from "react-icons/fa"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OrderEditDialogProps {
    order: Order
}

export default function OrderEditDialog({ order }: OrderEditDialogProps) {
    const [updateOrderStatus] = useUpdateOrderStatusMutation()
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState<UpdateOrderStatusDTO>({
        status: order.status,
        cancellationReason: order.cancellationReason ?? ""
    })

    const handleSubmit = async () => {
        try {
            await updateOrderStatus({
                orderId: order.orderId,
                updateData: formData
            }).unwrap()
            toast.success("Commande mise à jour avec succès")
            setIsOpen(false)
        } catch (error) {
            toast.error("Erreur lors de la mise à jour de la commande")
            console.error("Failed to update order:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <FaEllipsisH className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modifier la commande</DialogTitle>
                    <DialogDescription>
                        Modifier le statut de la commande.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="status" className="text-right">
                            Statut
                        </Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Order['status'] }))}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Sélectionnez le statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="IDLE">En attente</SelectItem>
                                <SelectItem value="PROCESSING">En traitement</SelectItem>
                                <SelectItem value="PROCESSED">Traitée</SelectItem>
                                <SelectItem value="COLLECTING">En collecte</SelectItem>
                                <SelectItem value="DELIVERING">En livraison</SelectItem>
                                <SelectItem value="DELIVERED">Livrée</SelectItem>
                                <SelectItem value="CANCELED">Annulée</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {formData.status === "CANCELED" && (
                        <div className="grid grid-cols-4 gap-4 items-center">
                            <Label htmlFor="cancellationReason" className="text-right">
                                Raison
                            </Label>
                            <Input
                                id="cancellationReason"
                                value={formData.cancellationReason || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, cancellationReason: e.target.value || undefined }))}
                                className="col-span-3"
                                placeholder="Raison de l'annulation"
                            />
                        </div>
                    )}
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