import { getUser } from "./auth";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseStorage } from "./config";

const IMAGES = 'images';

export enum FILE_TYPE {
    BUSINESS_IMAGE = 'business_image',
    REVIEW_IAMGE = 'review_image'
}

export async function uploadFile(file: Blob, fileType: FILE_TYPE = FILE_TYPE.BUSINESS_IMAGE): Promise<string | undefined> {
    if (!file) return;
    const user = getUser();
    if (!user) return;

    const filePath = `${getFilePath(fileType)}/${user.uid}/image.${file.type.split('/').pop()}`;

    const storageRef = ref(firebaseStorage, filePath);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef)
}

function getFilePath(fileType: FILE_TYPE): string {
    switch (fileType) {
        case FILE_TYPE.REVIEW_IAMGE:
            return `${IMAGES}/reviews`;
        default:
            return `${IMAGES}/business`;
    }
}