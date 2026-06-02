import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { Shipper, UpdateShipperDTO, useUpdateShipperMutation, useDeleteShipperMutation } from "@/redux/api/shipper";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShipperEditDialogProps {
    shipper: Shipper;
}

export const ShipperEditDialog: React.FC<ShipperEditDialogProps> = ({ shipper }) => {
    const [updateShipper] = useUpdateShipperMutation();
    const [deleteShipper] = useDeleteShipperMutation();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<UpdateShipperDTO>({
        firstName: shipper.firstName,
        lastName: shipper.lastName,
        password: "",
        email: shipper.email,
        phone: shipper.phone,
        pictureUrl: shipper.pictureUrl ?? "",
        isOnline: shipper.isOnline
    });
    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
    }>({});

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!formData.firstName?.trim()) {
            newErrors.firstName = "Le prénom est requis";
        }
        if (!formData.lastName?.trim()) {
            newErrors.lastName = "Le nom est requis";
        }
        if (!formData.email?.trim()) {
            newErrors.email = "L'email est requis";
        }
        if (!formData.phone?.trim()) {
            newErrors.phone = "Le numéro de téléphone est requis";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            await updateShipper({
                shipperId: shipper.shipperId,
                updateData: formData
            }).unwrap();
            toast.success("Livreur mis à jour avec succès");
            setIsOpen(false);
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du livreur");
            console.error("Failed to update shipper:", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livreur ?")) {
            try {
                await deleteShipper(shipper.shipperId).unwrap();
                toast.success("Livreur supprimé avec succès");
                setIsOpen(false);
            } catch (error) {
                console.error("Failed to delete shipper:", error);
                toast.error("Erreur lors de la suppression du livreur");
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier le livreur</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Photo</Label>
                        <ImageUpload
                            value={formData.pictureUrl}
                            onChange={(url) => setFormData({ ...formData, pictureUrl: url })}
                            onDelete={() => setFormData({ ...formData, pictureUrl: "" })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                        {errors.firstName && <span className="text-sm text-red-500">{errors.firstName}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                        {errors.lastName && <span className="text-sm text-red-500">{errors.lastName}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        {errors.phone && <span className="text-sm text-red-500">{errors.phone}</span>}
                    </div>
                    <div className="flex gap-2 items-center">
                        <Switch
                            checked={formData.isOnline}
                            onCheckedChange={(checked) => setFormData({ ...formData, isOnline: checked })}
                        />
                        <Label>En ligne</Label>
                    </div>
                </div>
                    <div className="flex justify-between pt-4">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            <Trash2 className="mr-2 w-4 h-4" />
                            Supprimer
                        </Button>
                        <Button type="button" onClick={handleSubmit}>
                            Enregistrer
                        </Button>
                    </div>
            </DialogContent>
        </Dialog>
    );
}