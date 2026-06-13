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
import { Agent, useUpdateAgentMutation, useDeleteAgentMutation } from "@/redux/api/agent";
import { useGetAllMarketsQuery } from "@/redux/api/market";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { ImageUpload, MultiImageUpload } from "@/components/ui/image-upload";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/slices/authSlice";

interface AgentEditDialogProps {
    agent: Agent;
}

const AgentEditDialog = ({ agent }: AgentEditDialogProps) => {
    const user = useSelector(selectCurrentUser)!;
    const [open, setOpen] = useState(false);
    const [updateAgent] = useUpdateAgentMutation();
    const [deleteAgent] = useDeleteAgentMutation();
    const { data: markets } = useGetAllMarketsQuery(user.areaCode ?? undefined);
    const [formData, setFormData] = useState({
        firstName: agent.firstName,
        lastName: agent.lastName,
        email: agent.email,
        phone: agent.phone,
        marketId: agent.marketId,
        password: "",
        pictureUrl: agent.pictureUrl || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updateData: any = { ...formData };

            // Remove empty fields
            Object.keys(updateData).forEach(key => {
                if (!updateData[key] && key !== "isOnline") {
                    delete updateData[key];
                }
            });

            // Transform marketId to market connect object
            if (updateData.marketId) {
                updateData.market = {
                    connect: {
                        marketId: updateData.marketId
                    }
                };
                delete updateData.marketId;
            }

            await updateAgent({
                agentId: agent.agentId,
                updateData,
            }).unwrap();

            toast.success("Vendeur mis à jour avec succès");
            setOpen(false);
        } catch (error) {
            console.error("Failed to update agent:", error);
            toast.error("Erreur lors de la mise à jour du vendeur");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce vendeur ?")) {
            try {
                await deleteAgent(agent.agentId).unwrap();
                toast.success("Vendeur supprimé avec succès");
                setOpen(false);
            } catch (error) {
                console.error("Failed to delete agent:", error);
                toast.error("Erreur lors de la suppression du vendeur");
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier le vendeur</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Photo</Label>
                        <ImageUpload
                            value={formData.pictureUrl}
                            onChange={(url) => setFormData({ ...formData, pictureUrl: url })}
                            onDelete={() => setFormData({ ...formData, pictureUrl: "" })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Prénom</label>
                            <Input
                                value={formData.firstName}
                                onChange={(e) =>
                                    setFormData({ ...formData, firstName: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nom</label>
                            <Input
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
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nouveau mot de passe (optionnel)</label>
                        <Input
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
                    <div className="flex justify-between pt-4">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            <Trash2 className="mr-2 w-4 h-4" />
                            Supprimer
                        </Button>
                        <Button type="submit">
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AgentEditDialog; 