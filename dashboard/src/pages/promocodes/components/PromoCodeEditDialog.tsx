import { useState } from "react";
import {
  PromoCode,
  PromoCodeType,
  UpdatePromoCodeDTO,
  useUpdatePromoCodeMutation,
} from "@/redux/api/promocode";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaEllipsisH } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PromoCodeEditDialogProps {
  promoCode: PromoCode;
}

export default function PromoCodeEditDialog({
  promoCode,
}: PromoCodeEditDialogProps) {
  const [updatePromoCode] = useUpdatePromoCodeMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<UpdatePromoCodeDTO>({
    code: promoCode.code,
    amount: promoCode.amount,
    discountType: promoCode.discountType,
    expiration: new Date(promoCode.expiration).toLocaleDateString(),
  });
  const [errors, setErrors] = useState<{
    code?: string;
    amount?: string;
    expiration?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (formData.code?.trim() === "") {
      newErrors.code = "Le code est requis";
    }

    if (formData.amount !== undefined && formData.amount <= 0) {
      newErrors.amount =
        formData.discountType === "PERCENTAGE"
          ? "Le pourcentage de réduction doit être supérieur à 0"
          : "Le montant de réduction doit être supérieur à 0";
    }

    if (
      formData.discountType === "PERCENTAGE" &&
      formData.amount !== undefined &&
      formData.amount > 100
    ) {
      newErrors.amount =
        "Le pourcentage de réduction ne peut pas dépasser 100%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await updatePromoCode({
        promoCodeId: promoCode.promoCodeId,
        updateData: {
          ...formData,
          amount: parseInt(formData.amount?.toString() ?? "0"),
        },
      }).unwrap();
      toast.success("Code promo mis à jour avec succès");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du code promo");
      console.error("Failed to update promo code:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <FaEllipsisH className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le code promo</DialogTitle>
          <DialogDescription>
            Modifier les informations du code promo afin de les mettre à jour.
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
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, code: e.target.value }))
              }
              className={`col-span-3 ${errors.code ? "border-red-500" : ""}`}
            />
            {errors.code && (
              <p className="col-span-3 col-start-2 text-sm text-red-500">
                {errors.code}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4 items-center">
            <Label htmlFor="discountType" className="text-right">
              Type
            </Label>
            <Select
              value={formData.discountType}
              onValueChange={(value: PromoCodeType) =>
                setFormData((prev) => ({ ...prev, discountType: value }))
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
              {formData.discountType === "PERCENTAGE"
                ? "Réduction (%)"
                : "Montant (FCFA)"}
            </Label>
            <Input
              id="amount"
              type="number"
              min="1"
              max={formData.discountType === "PERCENTAGE" ? "100" : undefined}
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  amount: parseInt(e.target.value),
                }))
              }
              className={`col-span-3 ${errors.amount ? "border-red-500" : ""}`}
            />
            {errors.amount && (
              <p className="col-span-3 col-start-2 text-sm text-red-500">
                {errors.amount}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4 items-center">
            <Label htmlFor="expiration" className="text-right">
              Date d'expiration
            </Label>
            <Input
              id="expiration"
              type="datetime-local"
              value={formData.expiration}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, expiration: e.target.value }))
              }
              className={`col-span-3 ${
                errors.expiration ? "border-red-500" : ""
              }`}
            />
            {errors.expiration && (
              <p className="col-span-3 col-start-2 text-sm text-red-500">
                {errors.expiration}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Mettre à jour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
