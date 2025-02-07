import { handleCustomError } from "@/utils/error";

/**
 * Uploads a file to Cloudinary and returns the Cloudinary URL of the uploaded image.
 * @param file The file to be uploaded.
 * @returns The Cloudinary URL of the uploaded image if the upload was successful, null otherwise.
 */
export const uploadImageToCloudinary = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "codeflare");
        formData.append("cloud_name", "dtwmrhc8d");

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/dtwmrhc8d/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await response.json();

        return data.secure_url; // image url
    } catch (err: unknown) {
        handleCustomError(err);
        return null;
    }
};
