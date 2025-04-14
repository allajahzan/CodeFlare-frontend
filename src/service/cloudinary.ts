import { handleCustomError } from "@/utils/error";
import { deleteData } from "./api-service";
import ApiEndpoints from "@/constants/api-endpoints";

/**
 * Uploads a file to Cloudinary and returns the Cloudinary URL of the uploaded image.
 * @param file The file to be uploaded.
 * @returns The Cloudinary URL of the uploaded image if the upload was successful, null otherwise.
 */
export const uploadImageToCloudinary = async (
    file: File
): Promise<{ imageUrl: string; publicId: string } | null> => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "codeflare");
        formData.append("cloud_name", "dtwmrhc8d");

        // Send request
        const resp = await fetch(
            `https://api.cloudinary.com/v1_1/dtwmrhc8d/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await resp.json();

        return {
            imageUrl: data.secure_url,
            publicId: data.public_id,
        };
    } catch (err: unknown) {
        handleCustomError(err);
        return null;
    }
};

/**
 * Deletes an image from Cloudinary by its public ID.
 * @param publicId The public ID of the image to be deleted.
 * @returns The response from Cloudinary API if the deletion was successful, null otherwise.
 */
export const deleteImageFromCloudinary = async (publicId: string) => {
    try {
        // Send request
        const resp = await deleteData(
            ApiEndpoints.DELETE_IMAGE + `?public_id=${publicId}`,
            "student"
        );

        if (resp && resp.status === 200) {
            console.log("Uploaded image deleted successfully");
        }
    } catch (err: unknown) {
        handleCustomError(err);
        return null;
    }
};
