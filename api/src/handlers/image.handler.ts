import { Hono } from "hono";
import { imageService } from "../services/image.service";

const app = new Hono();

app.post("/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const image = formData.get("image") as File;
    
    if (!image) {
      return c.json({ error: "No image provided" }, 400);
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(image.type)) {
      return c.json({ error: "Invalid image type. Supported types: JPG, PNG, WebP" }, 400);
    }

    const result = await imageService.uploadImage(image);
    return c.json(result);
  } catch (error) {
    console.error("Error uploading image:", error);
    return c.json({ error: "Failed to upload image" }, 500);
  }
});

app.delete("/:imageId", async (c) => {
  try {
    const {imageId} = c.req.param();
    await imageService.deleteImage(imageId);
    return c.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return c.json({ error: "Failed to delete image" }, 500);
  }
});

export default app;
