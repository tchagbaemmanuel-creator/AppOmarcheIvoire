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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateShipperDTO, useCreateShipperMutation } from "@/redux/api/shipper";
import { useGetAllMarketsQuery } from "@/redux/api/market";
import { useState } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";
import { FaPlus } from "react-icons/fa6";

export default function ShipperCreateDialog() {
    const [createShipper] = useCreateShipperMutation();
    const { data: markets } = useGetAllMarketsQuery();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<CreateShipperDTO>({
        marketId: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        pictureUrl: ""
    });
    const [errors, setErrors] = useState<{
        marketId?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        phone?: string;
    }>({});

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!formData.marketId) {
            newErrors.marketId = "Le marché est requis";
        }
        if (!formData.firstName.trim()) {
            newErrors.firstName = "Le prénom est requis";
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Le nom est requis";
        }
        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis";
        }
        if (!formData.password.trim()) {
            newErrors.password = "Le mot de passe est requis";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Le numéro de téléphone est requis";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            await createShipper(formData).unwrap();
            toast.success("Livreur créé avec succès");
            setIsOpen(false);
            setFormData({
                marketId: "",
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                phone: "",
                pictureUrl: ""
            });
        } catch (error) {
            toast.error("Erreur lors de la création du livreur");
            console.error("Failed to create shipper:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-orange-400 hover:bg-orange-500">Nouveau livreur
                    <FaPlus className="ml-2" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Créer un nouveau livreur</DialogTitle>
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
                        <Label htmlFor="market">Marché</Label>
                        <Select
                            value={formData.marketId}
                            onValueChange={(value) => setFormData({ ...formData, marketId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un marché" />
                            </SelectTrigger>
                            <SelectContent>
                                {markets?.map((market) => (
                                    <SelectItem key={market.marketId} value={market.marketId}>
                                        {market.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.marketId && <span className="text-sm text-red-500">{errors.marketId}</span>}
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
                        {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
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
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleSubmit}>Créer</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}