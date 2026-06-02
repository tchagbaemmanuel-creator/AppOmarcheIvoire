import { useState } from "react"
import { CreateUserDTO, useCreateUserMutation } from "@/redux/api/user"
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

export default function UserCreateDialog() {
    const [createUser] = useCreateUserMutation()
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState<CreateUserDTO>({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        city: "",
        address: "",
        phone: "",
    })
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        address?: string;
        phone?: string;
    }>({})

    const validateForm = () => {
        const newErrors: typeof errors = {}

        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "L'email n'est pas valide"
        }

        if (!formData.password.trim()) {
            newErrors.password = "Le mot de passe est requis"
        } else if (formData.password.length < 6) {
            newErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
        }

        if (!formData.firstName.trim()) {
            newErrors.firstName = "Le prénom est requis"
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Le nom est requis"
        }

        if (!formData.address.trim()) {
            newErrors.address = "L'adresse est requise"
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Le numéro de téléphone est requis"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        try {
            await createUser(formData).unwrap()
            toast.success("Utilisateur créé avec succès")
            setIsOpen(false)
            setFormData({
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                city: "",
                address: "",
                phone: "",
            })
        } catch (error) {
            toast.error("Erreur lors de la création de l'utilisateur")
            console.error("Failed to create user:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="bg-orange-400 hover:bg-orange-500">
                    Ajouter un utilisateur
                    <FaPlus className="ml-2" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un utilisateur</DialogTitle>
                    <DialogDescription>
                        Remplissez tous les champs pour créer un nouvel utilisateur.
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
                            <Label htmlFor="password" className="text-right">
                                Mot de passe
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                className="col-span-3"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        {errors.password && <p className="text-sm text-red-500 col-start-2 col-span-3">{errors.password}</p>}

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
                        Créer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
