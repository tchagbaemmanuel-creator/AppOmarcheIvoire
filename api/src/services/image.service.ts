import { randomUUID } from "crypto";
import { unlink } from "fs/promises";
import { mkdir } from "fs/promises";
import { join } from "path";
import AppError from "@/utils/AppError";

class ImageService {
	private readonly uploadDir = "./uploads";

	constructor() {
		// Ensure uploads directory exists
		mkdir(this.uploadDir, { recursive: true }).catch((error) => {
			throw new AppError("Erreur lors de la création du dossier d'upload", 500, error as Error);
		});
	}

	async uploadImage(file: File) {
		try {
			const fileExtension = file.type.split("/")[1];
			if (!fileExtension) {
				throw new AppError("Type de fichier non valide", 400, new Error("Invalid file type"));
			}

			const fileName = `${randomUUID()}.${fileExtension}`;
			const filePath = join(this.uploadDir, fileName);

			const arrayBuffer = await file.arrayBuffer();
			await Bun.write(filePath, arrayBuffer);

			return {
				id: fileName,
				url: `/uploads/${fileName}`,
				name: file.name,
				size: file.size,
				type: file.type,
			};
		} catch (error) {
			if (error instanceof AppError) throw error;
			throw new AppError("Erreur lors du téléchargement de l'image", 500, error as Error);
		}
	}

	async deleteImage(imageId: string) {
		try {
			const filePath = join(this.uploadDir, imageId);
			await Bun.write(filePath, ""); // Create empty file
			await unlink(filePath); // Use node's unlink instead
		} catch (error) {
			if (error instanceof AppError) throw error;
			throw new AppError("Erreur lors de la suppression de l'image", 500, error as Error);
		}
	}
}

export const imageService = new ImageService();
