import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateAgentMutation } from "@/redux/api/agent";
import { useGetAllMarketsQuery } from "@/redux/api/market";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/slices/authSlice";

const AgentCreateDialog = () => {
    const user = useSelector(selectCurrentUser)!;
    const [open, setOpen] = useState(false);
    const [createAgent] = useCreateAgentMutation();
    const { data: markets } = useGetAllMarketsQuery(user.areaCode ?? undefined);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        marketId: "",
        pictureUrl: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createAgent(formData).unwrap();
            setOpen(false);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                phone: "",
                marketId: "",
                pictureUrl: ""
            });
        } catch (error) {
            console.error("Failed to create agent:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-orange-400 hover:bg-orange-500">Ajouter un vendeur
                <FaPlus />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Créer un nouveau vendeur</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Photo</Label>
                        <ImageUpload
                            value={formData.pictureUrl}
                            onChange={(url) => setFormData({ ...formData, pictureUrl: url })}
                            onDelete={() => setFormData({ ...formData, pictureUrl: "" })}
                        />
                    <div className="grid grid-cols-2 gap-4">
                    </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Prénom</label>
                            <Input
                                required
                                value={formData.firstName}
                                onChange={(e) =>
                                    setFormData({ ...formData, firstName: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nom</label>
                            <Input
                                required
                                value={formData.lastName}
                                onChange={(e) =>
                                    setFormData({ ...formData, lastName: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Mot de passe</label>
                        <Input
                            required
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Téléphone</label>
                        <Input
                            required
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Marché</label>
                        <Select
                            value={formData.marketId}
                            onValueChange={(value) =>
                                setFormData({ ...formData, marketId: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un marché" />
                            </SelectTrigger>
                            <SelectContent>
                                {markets?.map((market) => (
                                    <SelectItem
                                        key={market.marketId}
                                        value={market.marketId}
                                    >
                                        {market.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full">
                        Créer
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AgentCreateDialog; 