import { useState } from "react"
import { UpdateUserDTO, User, useUpdateUserMutation } from "@/redux/api/user"
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
import { Pencil } from "lucide-react"

interface UserEditDialogProps {
    user: User;
}

export default function UserEditDialog({ user }: UserEditDialogProps) {
    const [updateUser] = useUpdateUserMutation()
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState<UpdateUserDTO>({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        city: user.city,
        address: user.address,
        phone: user.phone,
    })
    const [errors, setErrors] = useState<{
        email?: string;
        firstName?: string;
        lastName?: string;
        address?: string;
        phone?: string;
    }>({})

    const validateForm = () => {
        const newErrors: typeof errors = {}

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "L'email n'est pas valide"
        }

        if (formData.firstName && formData.firstName.length < 2) {
            newErrors.firstName = "Le prénom doit contenir au moins 2 caractères"
        }

        if (formData.lastName && formData.lastName.length < 2) {
            newErrors.lastName = "Le nom doit contenir au moins 2 caractères"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        try {
            await updateUser({ userId: user.userId, updateData: formData }).unwrap()
            toast.success("Utilisateur modifié avec succès")
            setIsOpen(false)
        } catch (error) {
            toast.error("Erreur lors de la modification de l'utilisateur")
            console.error("Failed to update user:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modifier l'utilisateur</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations de l'utilisateur. Laissez les champs vides pour conserver les valeurs actuelles.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                className="col-span-3"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        {errors.email && <p className="text-sm text-red-500 col-start-2 col-span-3">{errors.email}</p>}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right">
                                Prénom
                            </Label>
                            <Input
                                id="firstName"
                                className="col-span-3"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        {errors.firstName && <p className="text-sm text-red-500 col-start-2 col-span-3">{errors.firstName}</p>}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right">
                                Nom
                            </Label>
                            <Input
                                id="lastName"
                                className="col-span-3"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                        {errors.lastName && <p className="text-sm text-red-500 col-start-2 col-span-3">{errors.lastName}</p>}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="city" className="text-right">
                                Ville
                            </Label>
                            <Input
                                id="city"
                                className="col-span-3"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                                Adresse
                            </Label>
                            <Input
                                id="address"
                                className="col-span-3"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        {errors.address && <p className="text-sm text-red-500 col-start-2 col-span-3">{errors.address}</p>}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Téléphone
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                className="col-span-3"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        {errors.phone && <p className="text-sm text-red-500 col-start-2 col-span-3">{errors.phone}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>
                        Sauvegarder
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
